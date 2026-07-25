require 'rails_helper'

RSpec.describe TobaccoType, type: :model do
  describe "validations" do
    it "is valid with default attributes" do
      tobacco_type = build(:tobacco_type)
      expect(tobacco_type).to be_valid
    end

    it "is invalid without a name" do
      tobacco_type = build(:tobacco_type, name: nil)
      expect(tobacco_type).to be_invalid
      expect(tobacco_type.errors).to be_of_kind(:name, :blank)
    end

    it "is invalid when the name is longer than 30 characters" do
      tobacco_type = build(:tobacco_type, name: "a" * 30)
      expect(tobacco_type).to be_valid

      tobacco_type = build(:tobacco_type, name: "a" * 31)
      expect(tobacco_type).to be_invalid
    end

    it "is invalid when the name is already taken" do
      create(:tobacco_type, name: "duplicate")
      tobacco_type = build(:tobacco_type, name: "duplicate")
      expect(tobacco_type).to be_invalid
    end

    it "is invalid without an icon" do
      tobacco_type = build(:tobacco_type, icon: nil)
      expect(tobacco_type).to be_invalid
    end

    it "is invalid when the icon is longer than 255 characters" do
      tobacco_type = build(:tobacco_type, icon: "a" * 255)
      expect(tobacco_type).to be_valid

      tobacco_type = build(:tobacco_type, icon: "a" * 256)
      expect(tobacco_type).to be_invalid
    end

    it "is invalid without a display_order" do
      tobacco_type = build(:tobacco_type, display_order: nil)
      expect(tobacco_type).to be_invalid
    end

    it "is invalid when the display_order is already taken" do
      create(:tobacco_type, display_order: 100)
      tobacco_type = build(:tobacco_type, display_order: 100)
      expect(tobacco_type).to be_invalid
    end
  end
end
