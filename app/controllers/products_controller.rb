
class ProductsController < ApplicationController
  def index
    # TODO: respond to non-json requests informatively
    render json: Product.all
  end
end
