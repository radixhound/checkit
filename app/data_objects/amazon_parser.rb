class AmazonParser
  def initialize(body)
    @doc = Nokogiri::HTML(body)
  end

  def title
    @doc.at_xpath("//span[@id = 'productTitle']").text.gsub(/(\n\s+)+/, '')
  end

  def average_rating
    @doc.at_xpath(product_details_path + customer_reviews_path + star_icon_path).text
  end

  # Could also use a sibling selector to get the value based on the contents
  # of the sibling <td>
  def sales_rank
    @doc.at_xpath(product_details_path + "//tr[@id = 'SalesRank']").text.gsub(/(\n\s+)+/, '')
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