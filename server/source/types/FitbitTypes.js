/* @flow */

export type ResourceTypes =
  | "activities"
  | "profile"
  | "body/log/fat/date"
  | "body/log/weight/date"
  | "body/log/weight/goal"
  | "body/log/fat/goal"
  | "activities/heart/date"
  | "sleep/date"
  | "foods/log/goal"
  | "foods/log/date"
  | "activities/date"

export type FitbitUserId = string

export type FitbitTime = string
export type FitbitDate = string

export type FitbitScopesType =
  | "activity"
  | "location"
  | "heartrate"
  | "nutrition"
  | "profile"
  | "settings"
  | "sleep"
  | "social"
  | "weight"

export type FitbitAuthorizationPageParamsType = {
  client_id: string,
  response_type: "code" | "token", // Use "code" for Authorization Code Grant Flow
  scope: string, // URI encode w/ spaces between
  redirect_uri: string,
  expires_in?: number, // defaults to 86400 for 1 day, 31536000 for 1 year
}

export type FitbitAccessTokenRequestType = {
  code: string,
  grant_type: "authorization_code",
  client_id: string,
}

export type Locale = "en_AU" | "fr_FR" | "de_DE" | "ja_JP" | "en_NZ" | "es_ES" | "en_GB" | "en_US"

export type RequestHeaders = {
  "Accept-Locale"?: Locale,
  "Accept-Language"?: "en_US" | "en_GB",
}

export type ResponseHeaders = {
  "fitbit-rate-limit-limit": number,
  "fitbit-rate-limit-remaining": number,
  "fitbit-rate-limit-reset": number,
  "retry-after"?: number,
}

export type PeriodsToMonth = "1d" | "7d" | "1w" | "1m"

export type EndpointDateOnly = {| date: Date |}
export type EndPointDateToMonth = {| date: Date, period: PeriodsToMonth |}
export type EndpointDateToDate = {| baseDate: Date, endDate: Date |}

export type EndpointOptions = {||} | EndpointDateOnly | EndPointDateToMonth | EndpointDateToDate

export type ProfileResponse = {
  user: {
    aboutMe: any,
    avatar: any,
    avatar150: any,
    avatar640: any,
    city: any,
    clockTimeDisplayFormat: "12hour" | "24hour",
    country: any,
    dateOfBirth: any,
    displayName: any,
    distanceUnit: any,
    encodedId: any,
    foodsLocale: any,
    fullName: any,
    gender: "FEMALE" | "MALE" | "NA",
    glucoseUnit: any,
    height: any,
    heightUnit: any,
    locale: any,
    memberSince: any,
    offsetFromUTCMillis: any,
    startDayOfWeek: any,
    state: any,
    strideLengthRunning: any,
    strideLengthWalking: any,
    timezone: any,
    waterUnit: any,
    weight: any,
    weightUnit: any,
  },
}

export type FatGoalResponse = {
  goal: {
    fat: string,
  },
}

export type WeightGoalResponse = {
  goal: {
    startDate: FitbitDate,
    startWeight: string,
    weight: string,
  },
}

export type FatResponse = {
  fat: {
    date: FitbitDate,
    fat: number,
    logId: number,
    time: FitbitTime,
    source: "API" | "Aria",
  }[],
}

export type WeightResponse = {
  weight: {
    bmi: number,
    date: FitbitDate,
    logId: number,
    time: FitbitTime,
    weight: number,
    source: "API" | "Aria",
  }[],
}

export type HeartRateResponse = {
  "activities-heart": {
    dateTime: FitbitDate,
    value: {
      heartRateZones: {
        caloriesOut: number,
        max: number,
        min: number,
        minutes: number,
        name: string,
      }[],

      restingHeartRate: number,
    },
  }[],
}

export type FoodGoalResponse = {
  goals: {
    calories: number,
  },
  foodPlan: {
    intensity: string,
    estimatedDate: FitbitDate,
    personalized: boolean,
  },
}

export type Food = {
  isFavorite: boolean,
  logDate: FitbitDate,
  logId: number,
  loggedFood: {
    accessLevel: "PUBLIC" | "SHARED" | "PRIVATE",
    amount: number,
    brand: string,
    calories: number,
    foodId: number,
    mealTypeId: number,
    locale: Locale,
    name: string,
    unit: {
      id: number,
      name: string,
      plural: string,
    },
    units: number[],
  },
  nutritionalValues: {
    calories: number,
    carbs: number,
    fat: number,
    fiber: number,
    protein: number,
    sodium: number,
  },
}

export type FoodLogResponse = {
  foods: Food[],
  summary: {
    calories: number,
    carbs: number,
    fat: number,
    fiber: number,
    protein: number,
    sodium: number,
    water: number,
  },
  goals: {
    calories: number,
  },
}

export type Activity = {
  activityId: number,
  activityParentId: number,
  calories: number,
  description: string,
  distance: number,
  duration: number,
  hasStartTime: boolean,
  isFavorite: boolean,
  logId: number,
  name: string,
  startTime: FitbitTime,
  steps?: number,
}

export type DailyActivityResponse = {
  activities: Activity[],
  goals: {
    activityMinutes: number,
    caloriesOut: number,
    distance: number,
    floors: number,
    steps: number,
  },
  summary: {
    activityScore: number,
    activityCalories: number,
    caloriesBMR: number,
    caloriesOut: number,
    distances: { activity: string, distance: number }[],
    elevation: number,
    fairlyActiveMinutes: number,
    floors: number,
    heartRateZones: {
      caloriesOut: number,
      max: number,
      min: number,
      minutes: number,
      name: string,
    }[],
    lightlyActiveMinutes: number,
    marginalCalories: number,
    sedentaryMinutes: number,
    steps: number,
    veryActiveMinutes: number,
  },
}

export type FitbitResponse = any

export type FitbitEndpoint = (userId: FitbitUserId) => (options: EndpointOptions | void) => string
