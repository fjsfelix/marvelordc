class Character < ActiveRecord::Base
  scope :marvel, -> {where "universe = ?", "mavel"}
  scope :dc, -> {where "universe = ?", "dc"}
end
