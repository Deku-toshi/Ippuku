require 'rails_helper'

RSpec.describe "V1::SmokingAreas", type: :request do
  let!(:paper)      { create(:tobacco_type, :paper) }
  let!(:electronic) { create(:tobacco_type, :electronic) }

  describe "GET /v1/smoking_areas" do
    it "returns smoking areas ordered by id" do
      area_both   = create(:smoking_area, :with_both, name: "新宿東口喫煙所")
      area_e_only = create(:smoking_area, :electronic_only, name: "町田駅北口喫煙所")

      get "/v1/smoking_areas"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)

      expect(json.size).to eq 2
      expect(json.map { |a| a["name"] }).to eq [area_both.name, area_e_only.name]

      first = json.first
      expect(first.keys.sort).to eq %w[id name latitude longitude tobacco_type_ids].sort
      expect(first["latitude"]).to be_a(String)
      expect(first["longitude"]).to be_a(String)
      expect(first["latitude"].to_f).to eq area_both.latitude.to_f
      expect(first["longitude"].to_f).to eq area_both.longitude.to_f
      expect(first["tobacco_type_ids"]).to match_array [paper.id, electronic.id]
    end

    it "filters smoking areas by tobacco_type_id" do
      area_shinjuku = create(:smoking_area, :with_both, name: "新宿東口喫煙所")
      area_tokyo = create(:smoking_area, :with_both, name: "東京駅丸の内喫煙所")
      create(:smoking_area, :electronic_only, name: "町田駅北口喫煙所")

      get "/v1/smoking_areas", params: { tobacco_type_id: paper.id }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)

      expect(json.map { |a| a["name"] }).to contain_exactly(area_shinjuku.name, area_tokyo.name)
    end

    it "returns only electronic-only smoking areas when electronic_only is true" do
      create(:smoking_area, :with_both, name: "新宿東口喫煙所")
      area_machida = create(:smoking_area, :electronic_only, name: "町田駅北口喫煙所")
      area_yokohama = create(:smoking_area, :electronic_only, name: "横浜駅西口喫煙所")

      get "/v1/smoking_areas", params: { electronic_only: "true" }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)

      expect(json.map { |a| a["name"] }).to contain_exactly(area_machida.name, area_yokohama.name)
    end
  end
end
