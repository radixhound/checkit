class CreateProducts < ActiveRecord::Migration[5.2]
  def change
    create_table :products do |t|
      t.string :asin
      t.string :title
      t.decimal :rating
      t.integer :rank

      t.timestamps
    end
  end
end
