FactoryBot.define do
  factory :smoking_area do
    sequence(:name) { |n| "喫煙所#{n}" }
    latitude        { 35.690 }
    longitude       { 139.700 }

    trait :with_both do
      tobacco_type_ids do
        [ TobaccoType.find_by!(name: "紙タバコ").id,
          TobaccoType.find_by!(name: "電子タバコ").id ]
      end
    end

    trait :electronic_only do
      tobacco_type_ids { [ TobaccoType.find_by!(name: "電子タバコ").id ] }
    end
  end
end
