class CreateCharacters < ActiveRecord::Migration
  def change
    create_table :characters do |t|
      t.string :name, :universe
      t.integer :difficulty
      t.timestamps null: false
    end
  end
end
