FactoryBot.define do
  factory :tobacco_type do
    # name / display_order は一意制約があるため、既定値は sequence で衝突を避ける
    sequence(:name)          { |n| "タバコ種別#{n}" }
    icon                     { "cigarette" }
    sequence(:display_order) { |n| n + 100 }

    trait :paper do
      name          { "紙タバコ" }
      icon          { "cigarette" }
      display_order { 1 }
    end

    trait :electronic do
      name          { "電子タバコ" }
      icon          { "electronic cigarette" }
      display_order { 2 }
    end
  end
end
