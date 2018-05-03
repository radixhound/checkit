#
# Use rack-proxy to intercept requests that need to go to
# amazon and process the response, transforming the result
# into a simple json object and storing the parsed values
# in the database
#
class AmazonProxy < Rack::Proxy
  def perform_request(env)
    request = Rack::Request.new(env)

    if request.path =~ %r{^/dp}
      env['HTTP_HOST'] = 'www.amazon.com'
      @process_response = true
      super(env)
    else
      @process_response = false
      @app.call(env)
    end
  end

  def rewrite_response(triplet)
    if @process_response
      scrape_product_page(triplet)
    else
      triplet
    end
  end

  def scrape_product_page(triplet)
    status, headers, body = triplet
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, PUT, GET, OPTIONS'
    headers['Access-Control-Allow-Headers'] = '*'

    if body.first.present?
      ps = ::AmazonParser.build(body.first)
      body = ps.to_json
      Rails.logger.info body
      ps.save!
    end
    [status, headers, Array(body)]
  end
end

Rails.application.config.middleware.use AmazonProxy, backend: 'https://www.amazon.com', streaming: false
