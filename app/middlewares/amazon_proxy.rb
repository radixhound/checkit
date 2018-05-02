
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

    if body.first.present?
      ps = AmazonParser.new(body.first)
      Rails.logger.info "TITLE: " + ps.title
      Rails.logger.info "Average stars: " + ps.average_rating
      Rails.logger.info "Average stars: " + ps.sales_rank
    end

    body = "Got it!" # don't send 1m+ of text back to the client.
    triplet
  end

end
Rails.application.config.middleware.use AmazonProxy, backend: 'https://www.amazon.com', streaming: false

