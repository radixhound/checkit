
class DataParser
  def initialize(body)
    @doc = Nokogiri::HTML(body)
  end

  def title
    @doc.at_xpath("//span[@id = 'productTitle']").text.gsub(/(\n\s+)+/, '')
  end

  def average_rating
    @doc.at_xpath(product_details_section + customer_reviews_section + star_icon_path).text
  end

  def product_details_path
    "//div[@id = 'product-details-grid_feature_div']"
  end

  def customer_reviews_path
    "//tr[contains(@class, 'average_customer_reviews')]"
  end

  def star_icon_path
    "//i[contains(@class, 'a-icon-star')]"
  end
end

class AmazonProxy < Rack::Proxy

  def rewrite_env(env)
    request = Rack::Request.new(env)

    if request.path =~ %r{^/dp}
      env["HTTP_HOST"] = "www.amazon.com"
      super(env)
    else
      @app.call(env)
    end
  end

  def rewrite_response(triplet)
    status, headers, body = triplet
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, PUT, GET, OPTIONS'
    headers['Access-Control-Allow-Headers'] = '*'
    ps = DataParser.new(body.first)
    Rails.logger.info "TITLE: " + ps.title
    Rails.logger.info "Average stars: " + ps.average_rating

    # body = "Got it!" # don't send 1m+ of text back to the client...
    triplet
  end

end
Rails.application.config.middleware.use AmazonProxy, backend: 'https://www.amazon.com', streaming: false

