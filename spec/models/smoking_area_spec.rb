require 'rails_helper'

RSpec.describe SmokingArea, type: :model do
  describe "validations" do
    let!(:paper) { create(:tobacco_type, :paper) }
    let!(:electronic) { create(:tobacco_type, :electronic)}

    it "is valid with default attributes" do
      smoking_area = build(:smoking_area)
      expect(smoking_area).to be_valid
    end

    it "is invalid without a name" do
      smoking_area = build(:smoking_area, name: nil)
      expect(smoking_area).to be_invalid
      expect(smoking_area.errors).to be_of_kind(:name, :blank)
    end

    it "is invalid when the name is longer than 100 characters" do
      smoking_area = build(:smoking_area, name: "a" * 100)
      expect(smoking_area).to be_valid

      smoking_area = build(:smoking_area, name: "a" * 101)
      expect(smoking_area).to be_invalid
    end

    it "is invalid without a latitude" do
      smoking_area = build(:smoking_area, latitude: nil)
      expect(smoking_area).to be_invalid
    end

    it "is invalid without a longitude" do
      smoking_area = build(:smoking_area, longitude: nil)
      expect(smoking_area).to be_invalid
    end

    it "is invalid when the latitude is out of the -90..90 range" do
      smoking_area = build(:smoking_area, latitude: 90.1)
      expect(smoking_area).to be_invalid

      smoking_area = build(:smoking_area, latitude: -90.1)
      expect(smoking_area).to be_invalid

      smoking_area = build(:smoking_area, latitude: 90)
      expect(smoking_area).to be_valid
    end

    it "is invalid when the longitude is out of the -180..180 range" do
      smoking_area = build(:smoking_area, longitude: 180.1)
      expect(smoking_area).to be_invalid

      smoking_area = build(:smoking_area, longitude: -180.1)
      expect(smoking_area).to be_invalid

      smoking_area = build(:smoking_area, longitude: 180)
      expect(smoking_area).to be_valid
    end

    it "allows true, false and nil for is_indoor" do
      smoking_area = build(:smoking_area, is_indoor: true)
      expect(smoking_area).to be_valid

      smoking_area = build(:smoking_area, is_indoor: false)
      expect(smoking_area).to be_valid

      smoking_area = build(:smoking_area, is_indoor: nil)
      expect(smoking_area).to be_valid
    end

    it "is invalid when the address is longer than 255 characters" do
      smoking_area = build(:smoking_area, address: "a" * 255)
      expect(smoking_area).to be_valid

      smoking_area = build(:smoking_area, address: "a" * 256)
      expect(smoking_area).to be_invalid
    end

    it "is invalid when the detail is longer than 2000 characters" do
      smoking_area = build(:smoking_area, detail: "a" * 2000)
      expect(smoking_area).to be_valid

      smoking_area = build(:smoking_area, detail: "a" * 2001)
      expect(smoking_area).to be_invalid
    end
  end

  describe "normalize_tobacco_types" do
    context "when both paper and electronic master records exist" do
      let!(:paper) { create(:tobacco_type, :paper) }
      let!(:electronic) { create(:tobacco_type, :electronic)}

      it "assigns both tobacco types when none are given" do
        smoking_area = create(:smoking_area)
        expect(smoking_area.tobacco_type_ids).to match_array([paper.id, electronic.id])
      end

      it "adds the electronic type when only the paper type is given" do
        smoking_area = create(:smoking_area, tobacco_type_ids: [paper.id])
        expect(smoking_area.tobacco_type_ids).to match_array([paper.id, electronic.id])
      end

      it "keeps only the electronic type when only the electronic type is given" do
        smoking_area = create(:smoking_area, :electronic_only)
        expect(smoking_area.tobacco_type_ids).to match_array([electronic.id])
      end
    end

    context "when the master records do not exist" do
      it "is invalid because no tobacco type is assigned" do
        smoking_area = build(:smoking_area)
        expect(smoking_area).to be_invalid
        expect(smoking_area.errors[:tobacco_types]).to be_present
      end
    end
  end

  describe "associations" do
    let!(:electronic) { create(:tobacco_type, :electronic)}
    let!(:paper) { create(:tobacco_type, :paper) }

    it "returns tobacco types ordered by display_order" do
      smoking_area = create(:smoking_area, :with_both)
      expect(smoking_area.tobacco_types).to eq [paper, electronic]
    end

    it "destroys the join records when the smoking area is destroyed" do
      smoking_area = create(:smoking_area, :with_both)
      expect{ smoking_area.destroy } .to change(SmokingAreaTobaccoType, :count).by(-2)
    end
  end
end
