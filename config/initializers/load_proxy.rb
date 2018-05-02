
Rails.application.config.middleware.use AmazonProxy, backend: 'https://www.amazon.com', streaming: false

