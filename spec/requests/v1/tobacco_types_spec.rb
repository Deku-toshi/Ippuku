require 'rails_helper'

RSpec.describe "V1::TobaccoTypes", type: :request do
  describe "GET /v1/tobacco_types" do
    it "returns tobacco types sorted by display_order with only allowed fields" do
      # 並び替えを検証するため、あえて display_order の降順で作成する
      create(:tobacco_type, :electronic)
      create(:tobacco_type, :paper)

      get "/v1/tobacco_types"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)

      expect(json.size).to eq 2
      expect(json.map { |t| t["name"] }).to eq ["紙タバコ", "電子タバコ"]
      expect(json.map { |t| t["display_order"] }).to eq [1, 2]

      json.each do |t|
        expect(t.keys.sort).to eq %w[id name icon display_order].sort
      end
    end
  end
end
