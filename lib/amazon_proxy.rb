
class AmazonProxy < Rack::Proxy

  def perform_request(env)
    request = Rack::Request.new(env)

    if request.path =~ %r{^/dp}
      env["HTTP_HOST"] = "www.amazon.com"
      @process_response = true
      super(env)
    else
      @process_response = false
      @app.call(env)
    end
  end

  def rewrite_response(triplet)
    status, headers, body = triplet
    if @process_response
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, PUT, GET, OPTIONS'
      headers['Access-Control-Allow-Headers'] = '*'

      if body.first.present?
        ps = ::AmazonParser.new(body.first)
        body = ps.to_json
        ps.save!
        Rails.logger.info body
      end
      [status, headers, Array(body)]
    else
      triplet
    end
  end
end

Rails.application.config.middleware.use AmazonProxy, backend: 'https://www.amazon.com', streaming: false

