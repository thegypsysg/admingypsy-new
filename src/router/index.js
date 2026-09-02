import { createRouter, createWebHistory } from 'vue-router';
import { tokenStorage } from '@/util/tokenStorage';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/dashboard/AdminContainer.vue'),
  },
  {
    name: 'login',
    path: '/auth/login',
    component: () => import('@/views/login/AdminPage.vue'),
    meta: { public: true },
  },
  {
    name: 'user master',
    path: '/users',
    component: () => import('@/views/users/UsersContainer.vue'),
  },
  {
    name: 'invite users',
    path: '/invite_users',
    component: () => import('@/views/registration/invite/InviteContainer.vue'),
  },
  {
    name: 'registered users',
    path: '/registered_users',
    component: () =>
      import('@/views/registration/registered/RegisteredContainer.vue'),
  },
  {
    name: 'app new',
    path: '/app-new',
    component: () => import('@/views/app-master/app-new/AppNewContainer.vue'),
  },
  {
    name: 'app country',
    path: '/app-country',
    component: () =>
      import(
        '@/views/app-master/app-country-city/country/AppCountryContainer.vue'
      ),
  },
  {
    name: 'app city',
    path: '/app-city',
    component: () =>
      import('@/views/app-master/app-country-city/city/AppCityContainer.vue'),
  },
  {
    name: 'industry master',
    path: '/industry_master',
    component: () =>
      import('@/views/industry-master/industry/IndustryMasterContainer.vue'),
  },
  {
    name: 'sub industry master',
    path: '/sub_industry_master',
    component: () =>
      import(
        '@/views/industry-master/sub-industry/SubIndustryMasterContainer.vue'
      ),
  },
  {
    name: 'position master',
    path: '/position_master',
    component: () =>
      import('@/views/position-master/PositionMasterContainer.vue'),
  },
  {
    name: 'city master',
    path: '/city-master',
    component: () =>
      import('@/views/manage-countries/city-master/CityMasterContainer.vue'),
  },
  {
    name: 'town master',
    path: '/town-master',
    component: () =>
      import('@/views/manage-countries/town-master/TownMasterContainer.vue'),
  },
  {
    name: 'country master',
    path: '/country-master',
    component: () =>
      import(
        '@/views/manage-countries/country-master/CountryMasterContainer.vue'
      ),
  },
  {
    name: 'zone master',
    path: '/zone-master',
    component: () =>
      import('@/views/manage-countries/zone-master/ZoneMasterContainer.vue'),
  },
  {
    name: 'email master',
    path: '/email-master',
    component: () =>
      import('@/views/email-master/email-master/EmailMasterContainer.vue'),
  },
  {
    name: 'address master',
    path: '/address-master',
    component: () =>
      import(
        '@/views/address-master/address-master/AddressMasterContainer.vue'
      ),
  },
  {
    name: 'platform fee',
    path: '/platform-fee',
    component: () =>
      import('@/views/platform-fee/platform-fee/PlatformFeesContainer.vue'),
  },
  {
    name: 'gst-master',
    path: '/gst-master',
    component: () =>
      import('@/views/gst-master/gst-master/GstMasterContainer.vue'),
  },
  {
    name: 'delivery-charges',
    path: '/delivery-charges',
    component: () =>
      import(
        '@/views/delivery-charges/delivery-charges/DeliveryChargesContainer.vue'
      ),
  },
  {
    name: 'email master main info',
    path: '/email-master/main-info/:id',
    component: () =>
      import(
        '@/views/email-master/email-master/main-info/MainInfoContainer.vue'
      ),
  },
  {
    name: 'smtp master',
    path: '/smtp-master',
    component: () =>
      import('@/views/email-master/smtp-master/SMTPMasterContainer.vue'),
  },
  {
    name: 'healthcare settings',
    path: '/healthcare-settings',
    component: () =>
      import(
        '@/views/the-syringe/healthcare-settings/HealthcareSettingsContainer.vue'
      ),
  },
  {
    name: 'skills group',
    path: '/skills-group',
    component: () =>
      import('@/views/skills-master/skills-group/SkillsGroupContainer.vue'),
  },
  {
    name: 'primary skills',
    path: '/primary-skills',
    component: () =>
      import('@/views/skills-master/primary-skills/PrimarySkillsContainer.vue'),
  },
  {
    name: 'primary skills regurable association',
    path: '/primary-skills/regu-assoc/:id',
    component: () =>
      import(
        '@/views/skills-master/primary-skills/regu-assoc/ReguAssocContainer.vue'
      ),
  },
  {
    name: 'primary skills country',
    path: '/primary-skills/country/:id',
    component: () =>
      import(
        '@/views/skills-master/primary-skills/country/CountryContainer.vue'
      ),
  },

  {
    name: 'jobs master',
    path: '/jobs-master',
    component: () => import('@/views/job-master/JobMasterContainer.vue'),
  },
  {
    name: 'jobs master detail',
    path: '/jobs-master/:id',
    component: () =>
      import('@/views/job-master/detail/JobMasterDetailContainer.vue'),
  },
  {
    name: 'jobs master description',
    path: '/jobs-master/desc/:id',
    component: () =>
      import('@/views/job-master/description/JobMasterDescContainer.vue'),
  },
  {
    name: 'jobs master country',
    path: '/jobs-master/show-in-country/:id',
    component: () => import('@/views/job-master/country/CountryContainer.vue'),
  },
  {
    name: 'Application master',
    path: '/application-master',
    component: () =>
      import('@/views/application-master/ApplicationMasterContainer.vue'),
  },
  {
    name: 'Applicant master',
    path: '/applicant-master',
    component: () =>
      import('@/views/applicant-master/ApplicantMasterContainer.vue'),
  },
  {
    name: 'onboard merchant',
    path: '/onboard-merchant',
    component: () =>
      import('@/views/onboard-merchant/OnboardMerchantContainer.vue'),
  },
  {
    name: 'main.restaurant-master',
    path: '/restaurant-master',
    component: () =>
      import('@/views/restaurant-master/RestaurantMasterContainer.vue'),
  },
  {
    name: 'menu management',
    path: '/menu-management',
    component: () =>
      import('@/views/menu-management/management/MenuManagementContainer.vue'),
  },
  {
    name: 'menu category',
    path: '/menu-category',
    component: () =>
      import('@/views/menu-management/category/MenuCategoryContainer.vue'),
  },
  {
    name: 'main.dish-master',
    path: '/dish-master',
    component: () => import('@/views/dish-master/DishMasterContainer.vue'),
  },

  {
    name: 'inquiry master',
    path: '/inquiry-master',
    component: () => import('@/views/inquiry-master/InquiryContainer.vue'),
  },
  {
    name: 'partner master',
    path: '/partner_master',
    component: () =>
      import('@/views/partner-master/PartnerMasterContainer.vue'),
  },
  {
    name: 'partner master main info',
    path: '/partner_master/main-info/:id',
    component: () =>
      import('@/views/partner-master/main-info/MainInfoContainer.vue'),
  },
  {
    name: 'partner master contacts',
    path: '/partner_master/contacts/:id',
    component: () =>
      import('@/views/partner-master/contacts/ContactsContainer.vue'),
  },
  {
    name: 'partner master socials',
    path: '/partner_master/socials/:id',
    component: () =>
      import('@/views/partner-master/socials/SocialsContainer.vue'),
  },
  {
    name: 'partner master locations',
    path: '/partner_master/locations/:id',
    component: () =>
      import('@/views/partner-master/locations/LocationsContainer.vue'),
  },

  {
    name: 'category master',
    path: '/category_master',
    component: () =>
      import('@/views/category-master/CategoryMasterContainer.vue'),
  },
  {
    name: 'product master',
    path: '/product_master',
    component: () =>
      import('@/views/product-master/ProductMasterContainer.vue'),
  },
  {
    name: 'cart master',
    path: '/cart_master',
    component: () => import('@/views/cart-master/CartMasterContainer.vue'),
  },
  {
    name: 'order fulfillment',
    path: '/order_fulfillment',
    component: () =>
      import('@/views/order-fulfillment/OrderFulfillmentContainer.vue'),
  },
  {
    name: 'sourcing basket',
    path: '/sourcing_basket',
    component: () =>
      import('@/views/sourcing-basket/SourcingBasketContainer.vue'),
  },
  {
    name: 'price list master',
    path: '/price_list_master',
    component: () =>
      import('@/views/price-list-master/PriceListMasterContainer.vue'),
  },
  {
    name: 'product range',
    path: '/product_range/:id',
    component: () =>
      import('@/views/product-master/range/ProductRangeContainer.vue'),
  },
  {
    name: 'quantity master',
    path: '/quantity_master',
    component: () =>
      import('@/views/quantity-master/QuantityMasterContainer.vue'),
  },
  {
    name: 'brands master',
    path: '/brands_master',
    component: () =>
      import('@/views/category-master/brands-master/BrandsMasterContainer.vue'),
  },
  {
    name: 'qualification master',
    path: '/qualification_master',
    component: () =>
      import('@/views/qualification-master/QualificationMasterContainer.vue'),
  },
  {
    name: 'qualification master skills',
    path: '/qualification_master/skills/:id',
    component: () =>
      import(
        '@/views/qualification-master/skills/QualificationSkillsContainer.vue'
      ),
  },
  {
    name: 'course master',
    path: '/course_master',
    component: () => import('@/views/course-master/CourseMasterContainer.vue'),
  },
  {
    name: 'university master',
    path: '/university_master',
    component: () =>
      import('@/views/course-master/university/UniversityMasterContainer.vue'),
  },
  {
    name: 'course master registrable',
    path: '/course_master/registrable/:id',
    component: () =>
      import(
        '@/views/course-master/registrable/CourseRegistrableContainer.vue'
      ),
  },
  {
    name: 'walls master',
    path: '/walls_master',
    component: () => import('@/views/walls-master/WallsMasterContainer.vue'),
  },
  {
    name: 'property types',
    path: '/property_types',
    component: () =>
      import('@/views/walls-master/property-types/PropertyTypesContainer.vue'),
  },
  {
    name: 'property developers',
    path: '/property_developers',
    component: () =>
      import(
        '@/views/walls-master/property-developers/PropertyDevelopersContainer.vue'
      ),
  },
  {
    name: 'property developments',
    path: '/property_developments',
    component: () =>
      import(
        '@/views/walls-master/property-developments/PropertyDevelopmentsContainer.vue'
      ),
  },
  {
    name: 'property developments main info',
    path: '/property_developments/main-info/:id',
    component: () =>
      import(
        '@/views/walls-master/property-developments/main-info/PropertyDevelopmentsMainInfoContainer.vue'
      ),
  },
  {
    name: 'construction master main info',
    path: '/construction_master/main_info/:id',
    component: () =>
      import(
        '@/views/walls-master/construction-master/main-info/ConstructionMasterMainInfoContainer.vue'
      ),
  },
  {
    name: 'main categories',
    path: '/main_categories',
    component: () =>
      import(
        '@/views/walls-master/main-categories/MainCategoriesContainer.vue'
      ),
  },
  {
    name: 'construction category',
    path: '/construction_category',
    component: () =>
      import(
        '@/views/walls-master/construction-category/ConstructionCategoryContainer.vue'
      ),
  },
  {
    name: 'construction master',
    path: '/construction_master',
    component: () =>
      import(
        '@/views/walls-master/construction-master/ConstructionMasterContainer.vue'
      ),
  },
  {
    name: 'building type',
    path: '/building_type',
    component: () =>
      import('@/views/walls-master/building-type/BuildingTypeContainer.vue'),
  },
  {
    name: 'facilities',
    path: '/facilities',
    component: () =>
      import('@/views/walls-master/facility/FacilityContainer.vue'),
  },
  {
    name: 'apartment type master',
    path: '/apartment_type_master',
    component: () =>
      import(
        '@/views/walls-master/apartment-type-master/ApartmentTypeMasterContainer.vue'
      ),
  },
  {
    name: 'rate type master',
    path: '/rate_type_master',
    component: () =>
      import('@/views/walls-master/rate-types/RateTypesContainer.vue'),
  },
  {
    name: 'development construction',
    path: '/property_developments/development_construction/:id',
    component: () =>
      import(
        '@/views/walls-master/property-developments/development-construction/DevelopmentConstructionContainer.vue'
      ),
  },
  {
    name: 'construction facility',
    path: '/construction_master/facility/:id',
    component: () =>
      import(
        '@/views/walls-master/construction-master/construction-facility/ConstructionFacilityContainer.vue'
      ),
  },
  {
    name: 'construction apartment',
    path: '/construction_master/apartment/:id',
    component: () =>
      import(
        '@/views/walls-master/construction-master/construction-apartment/ConstructionApartmentContainer.vue'
      ),
  },
  {
    name: 'property master',
    path: '/property_master',
    component: () =>
      import(
        '@/views/walls-master/property-master/PropertyMasterContainer.vue'
      ),
  },
  {
    name: 'property master rates',
    path: '/property_master/rates/:id',
    component: () =>
      import('@/views/walls-master/property-master/rates/RatesContainer.vue'),
  },
  {
    name: 'agent master',
    path: '/agent_master',
    component: () =>
      import('@/views/walls-master/agent-master/AgentMasterContainer.vue'),
  },
  {
    name: 'biryani run',
    path: '/biryani-home',
    component: () => import('@/views/biryani-run/BiryaniRunContainer.vue'),
  },
  {
    name: 'biryani main categories',
    path: '/biryani-home/main-categories',
    component: () =>
      import('@/views/biryani-run/main-categories/MainCategoriesContainer.vue'),
  },
  {
    name: 'biryani onboard dishes',
    path: '/biryani-home/onboard-dishes',
    component: () =>
      import('@/views/biryani-run/onboard-dishes/OnboardDishesContainer.vue'),
  },
  {
    name: 'biryani onboard prices',
    path: '/biryani-home/onboard-prices',
    component: () =>
      import('@/views/biryani-run/onboard-prices/OnboardPricesContainer.vue'),
  },
  {
    name: 'biryani onboard prices pax kgs',
    path: '/biryani-home/onboard-prices/pax-kgs/:id',
    component: () =>
      import(
        '@/views/biryani-run/onboard-prices/pax-kgs/OnboardPricesPaxKgsContainer.vue'
      ),
  },
  {
    name: 'biryani.restaurant-master',
    path: '/biryani-home/restaurant-master',
    component: () =>
      import(
        '@/views/biryani-run/restaurant-master/RestaurantMasterContainer.vue'
      ),
  },
  {
    name: 'biryani.dish-master',
    path: '/biryani-home/dish-master',
    component: () =>
      import('@/views/biryani-run/dish-master/DishMasterContainer.vue'),
  },
  {
    name: 'restaurant dish',
    path: '/biryani-home/restaurant-dish',
    component: () =>
      import('@/views/biryani-run/restaurant-dish/RestaurantDishContainer.vue'),
  },
  {
    name: 'mall master',
    path: '/mall_master',
    component: () => import('@/views/mall-master/MallMasterContainer.vue'),
  },
  {
    name: 'mall levels',
    path: '/mall_master/levels/:id',
    component: () =>
      import('@/views/mall-master/mall-levels/MallLevelsContainer.vue'),
  },
  {
    name: 'mall services',
    path: '/mall_master/services/:id',
    component: () =>
      import('@/views/mall-master/mall-services/MallServicesContainer.vue'),
  },
  {
    name: 'merchants master',
    path: '/merchants_master',
    component: () =>
      import('@/views/mall-master/merchants/MerchantsMasterContainer.vue'),
  },
  {
    name: 'manage events',
    path: '/manage_events',
    component: () =>
      import('@/views/mall-master/manage-events/ManageEventsContainer.vue'),
  },
  {
    name: 'manage events main info',
    path: '/manage_events/main-info/:id',
    component: () =>
      import(
        '@/views/mall-master/manage-events/main-info/EventsMainInfoContainer.vue'
      ),
  },
  {
    name: 'manage parking info',
    path: '/manage_parking_info',
    component: () =>
      import(
        '@/views/mall-master/manage-parking-info/ManageParkingInfoContainer.vue'
      ),
  },
  {
    name: 'manage parking info main info',
    path: '/manage_parking_info/main-info/:id',
    component: () =>
      import(
        '@/views/mall-master/manage-parking-info/main-info/ParkingInfoMainInfoContainer.vue'
      ),
  },
  {
    name: 'manage parking info services',
    path: '/manage_parking_info/services/:id',
    component: () =>
      import(
        '@/views/mall-master/manage-parking-info/services/ServicesContainer.vue'
      ),
  },
  {
    name: 'manage parking info levels',
    path: '/manage_parking_info/levels/:id',
    component: () =>
      import(
        '@/views/mall-master/manage-parking-info/levels/LevelsContainer.vue'
      ),
  },
  {
    name: 'manage jobs',
    path: '/manage_jobs',
    component: () =>
      import('@/views/mall-master/manage-jobs/ManageJobsContainer.vue'),
  },
  {
    name: 'manage jobs main info',
    path: '/manage_jobs/main-info/:id',
    component: () =>
      import(
        '@/views/mall-master/manage-jobs/main-info/JobsMainInfoContainer.vue'
      ),
  },
  {
    name: 'manage mall promos',
    path: '/manage_mall_promos',
    component: () =>
      import(
        '@/views/mall-master/manage-mall-promos/ManageMallPromosContainer.vue'
      ),
  },
  {
    name: 'manage mall promos main info',
    path: '/manage_mall_promos/main-info/:id',
    component: () =>
      import(
        '@/views/mall-master/manage-mall-promos/main-info/MallPromosMainInfoContainer.vue'
      ),
  },
  {
    name: 'manage levels',
    path: '/manage_levels',
    component: () =>
      import('@/views/mall-master/manage-levels/ManageLevelsContainer.vue'),
  },
  {
    name: 'manage services',
    path: '/manage_services',
    component: () =>
      import('@/views/mall-master/manage-services/ManageServicesContainer.vue'),
  },
  {
    name: 'outlets master',
    path: '/outlets_master',
    component: () =>
      import('@/views/mall-master/outlets/OutletsMasterContainer.vue'),
  },
  {
    name: 'promotions master',
    path: '/promotions_master',
    component: () =>
      import('@/views/mall-master/promotions/PromotionsMasterContainer.vue'),
  },
  {
    name: 'promotions master main info',
    path: '/promotions_master/main-info/:id',
    component: () =>
      import(
        '@/views/mall-master/promotions/main-info/PromotionsMainInfoContainer.vue'
      ),
  },
  {
    name: 'promotions master outlets',
    path: '/promotions_master/outlets/:id_promo/:id_merchant',
    component: () =>
      import('@/views/mall-master/promotions/outlets/OutletsContainer.vue'),
  },
  {
    name: 'tag header',
    path: '/tag-header',
    component: () =>
      import('@/views/mall-master/tag-header/TagHeaderContainer.vue'),
  },
  {
    name: 'tag master',
    path: '/tag-master',
    component: () =>
      import('@/views/mall-master/tag-master/TagMasterContainer.vue'),
  },
  {
    name: 'displayed banners',
    path: '/displayed-banners',
    component: () =>
      import(
        '@/views/mall-master/displayed-banners/DisplayedBannersContainer.vue'
      ),
  },
  {
    name: 'displayed banners main info',
    path: '/displayed-banners/main-info/:id',
    component: () =>
      import(
        '@/views/mall-master/displayed-banners/main-info/BannerMainInfoContainer.vue'
      ),
  },
  {
    name: 'displayed banners outlets',
    path: '/displayed-banners/outlets/:id_banner/:id_merchant',
    component: () =>
      import(
        '@/views/mall-master/displayed-banners/outlets/OutletsContainer.vue'
      ),
  },
  {
    name: 'mall country',
    path: '/mall-country',
    component: () =>
      import(
        '@/views/mall-master/countryCity/country/MallCountryContainer.vue'
      ),
  },
  {
    name: 'mall city',
    path: '/mall-city',
    component: () =>
      import('@/views/mall-master/countryCity/city/MallCityContainer.vue'),
  },

  {
    path: '/:pathMatch(.*)*', // Rute ini akan menangkap semua rute yang tidak cocok dengan rute lainnya
    redirect: '/', // Alihkan ke halaman dashboard
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = tokenStorage.isAuthenticated();
  const isPublicRoute = to.meta?.public === true;

  if (!isAuthenticated && !isPublicRoute) {
    return next({ name: 'login' });
  }

  if (isAuthenticated && to.name === 'login') {
    return next({ name: 'home' });
  }

  next();
});

export default router;
