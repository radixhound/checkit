class AmazonParser
  def self.build(body)
    doc = Nokogiri::HTML(body)
    if doc.at_xpath("//div[@id = 'prodDetails']")
      ProductInformationParser.new(doc)
      # Presumably the page has 'Product information' and we can fetch it that way
    elsif doc.at_xpath("//div[@id = 'detailBullets']")
      # Let's try a different parsing method
      ProductDescriptionParser.new(doc)
    else
      NullParser.new
    end
  end

  def initialize(html_doc)
    @doc = html_doc
  end

  # Push the data into the DB, overwriting any existing records
  def save!
    product = Product.find_or_create_by(asin: asin)
    product.update_attributes(title: title, rating: rating, rank: rank)
  end

  def asin
    @doc.at_xpath("//input[@id = 'ftSelectAsin']")['value']
  end

  def title
    @doc.at_xpath("//span[@id = 'productTitle']").text.gsub(/(\n\s+)+/, '')
  end

  def as_json(options = {})
    {
      asin: asin,
      title: title,
      rating: rating.to_f,
      rank: rank.to_i
    }
  end
end

class NullParser
  def as_json(options = {})
    {}
  end

  def present?
    false
  end

  def save!
    raise "You can't save a null Parser"
  end
end

class ProductInformationParser < AmazonParser
  def rating
    @doc.at_xpath(product_details_path + customer_reviews_path + star_icon_path).text
  end

  # Could also use a sibling selector to get the value based on the contents
  # of the sibling <td>
  def rank
    @doc.at_xpath(product_details_path + "//tr[@id = 'SalesRank']").text.gsub(/(\n\s+)+/, '').gsub(/^.*?\#/, '')
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

class ProductDescriptionParser < AmazonParser
  def rating
    @doc.at_xpath(customer_reviews_path + star_icon_path).text
  end

  # Could also use a sibling selector to get the value based on the contents
  # of the sibling <td>
  def rank
    @doc.at_xpath("//li[@id = 'SalesRank']").text.gsub(/(\n\s+)+/, '').gsub(/^.*?\#/, '')
  end

  def customer_reviews_path
    "//div[@id = 'detailBullets_averageCustomerReviews']"
  end

  def star_icon_path
    "//i[contains(@class, 'a-icon-star')]"
  end
end