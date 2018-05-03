#
# Use rack-proxy to intercept requests that need to go to
# amazon and process the response, transforming the result
# into a simple json object and storing the parsed values
# in the database
#
# This middleware is triggered for all requests, so requests
# to the main rails app need to be conditionally filtered out
# the @process_response flag is used to signal to the response
# processing to do nothing for rails requests
#
class AmazonProxy < Rack::Proxy
  HOST = 'www.amazon.com'
  BACKEND = "https://#{HOST}"

  def perform_request(env)
    request = Rack::Request.new(env)

    if request.path =~ %r{^/dp}
      env['HTTP_HOST'] = HOST
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

    # Intercept the headers so that the JS thinks that CORS is allowed.
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

Rails.application.config.middleware.use AmazonProxy, backend: AmazonProxy::BACKEND, streaming: false
