const Joi = require('joi')
const addRole = require('./addRole.validator'),
  getRoleInfo = require('./cities.validator'),
  updateRole = require('./updateRole.validator'),
  addUser = require('./addUser.validator'),
  getUsers = require('./getUsers.validator'),
  getUserInfo = require('./getUserInfo.validator'),
  updateUser = require('./updateUser.validator'),
  updateUserStatus = require('./updateUserStatus.validator'),
  login = require('./login.validator'),
  addVehicle = require('./addVehicle.validator'),
  updateVehicle = require('./updateVehicle.validator'),
  addClient = require('./addClient.validator'),
  updateClient = require('./updateClient.validator'),
  signup = require('./signup.validator'),
  updateProfile = require('./updateProfile.validator'),
  addChargingHistory = require('./addChargingHistory.validator'),
  addVehicleService = require('./addVehicleService.validator'),
  addInsuranceUser = require('./addInsuranceUser.validator'),
  updateInsuranceUser = require('./updateInsuranceUser.validator');

const getVehicleInfo = Joi.object({
  iot_id: Joi.string().optional(),
  vin_number: Joi.string().optional(),
  size: Joi.string().allow('').optional(),
  fromDate: Joi.string().allow('').optional(),
  toDate: Joi.string().allow('').optional(),
  pageNo: Joi.string().allow('').optional(),
})

const getVehicleInfoAll = Joi.object({
  dvid: Joi.string().required(),
  size: Joi.string().allow('').optional(),
  pageNo: Joi.string().allow('').optional(),
})

const getCities = Joi.object({
  state_id: Joi.number().required(),
})

const updateVehicleStatus = Joi.object({
  id: Joi.number().required(),
  status: Joi.number().required(),
  Authorization: Joi.string().allow('').optional(),
})

const assignVehicle = Joi.object({
  vehicle_id: Joi.string().required(),
  dealer_id: Joi.number().required(),
  Authorization: Joi.string().allow('').optional(),
})

const deleteVehicle = Joi.object({
  id: Joi.number().required(),
  Authorization: Joi.string().allow('').optional(),
})

const deleteUser = Joi.object({
  id: Joi.number().required(),
  Authorization: Joi.string().allow('').optional(),
})

const updateConfig = Joi.object({
  user_id: Joi.number().required(),
  db_host: Joi.string().required(),
  db_name: Joi.string().required(),
  db_user: Joi.string().required(),
  db_password: Joi.string().required(),
  Authorization: Joi.string().allow('').optional(),
})

const signin = Joi.object({
  mobile: Joi.string()
    .min(10)
    .message('Mobile min length is 10')
    .max(10)
    .message('Mobile max length is 10')
    .required(),
})

const changePassword = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
  Authorization: Joi.string().allow('').optional(),
})

const verifyOTP = Joi.object({
  mobile: Joi.string()
    .min(10)
    .message('Mobile min length is 10')
    .max(10)
    .message('Mobile max length is 10')
    .required(),
  otp: Joi.number().required(),
})

const addOwnVehicle = Joi.object({
  iot_id: Joi.string().required(),
  Authorization: Joi.string().allow('').optional(),
})

const updateProfileImage = Joi.object({
  profile_image: Joi.string().allow('').optional(),
  user_id: Joi.number().required(),
  Authorization: Joi.string().allow('').optional(),
})

const updateStatus = Joi.object({
  status: Joi.number().valid(1, 0),
  user_id: Joi.number().required(),
  Authorization: Joi.string().allow('').optional(),
})

const getChargingHistories = Joi.object({
  vehicle_id: Joi.number().required(),
})

const dropFromDealer = Joi.object({
  vehicle_id: Joi.number().required(),
  dealer_id: Joi.number().required(),
  Authorization: Joi.string().allow('').optional(),
})

const getVehicleInfoPredction = Joi.object({
  vin_number: Joi.string().required(),
  Authorization: Joi.string().allow('').optional(),
})

const updateProfileData = Joi.object({
  name: Joi.string().required(),
  mobile: Joi.string()
    .min(10)
    .message('Mobile min length is 10')
    .max(10)
    .message('Mobile max length is 10')
    .required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  city: Joi.string().required(),
  country_id: Joi.number().allow('').optional(),
  state_id: Joi.number().required(),
  city_id: Joi.number().required(),
  state: Joi.string().required(),
  profile_image: Joi.string().allow('').optional(),
  address: Joi.string().allow('').optional(),
  Authorization: Joi.string().allow('').optional(),
})

const vehicleDownload = Joi.object({
  iot_id: Joi.string().required(),
  from_date: Joi.string().required(),
  to_date: Joi.string().required(),
  Authorization: Joi.string().allow('').optional(),
})

const getInsuranceUsers = Joi.object({
  keyword: Joi.string().allow('').optional(),
  limit: Joi.number().required(),
  pageNo: Joi.number().required(),
  filter: Joi.string().allow('').optional(),
  role_id: Joi.string().allow('').optional(),
  oem_id: Joi.string().allow('').optional(),
  parent_id: Joi.string().allow('').optional(),
})

const getModelList = Joi.object({
  oem_id: Joi.number().required(),
})

const addVehicleModelController = Joi.object({
  oem_id: Joi.number().required(),
  model_name: Joi.string().required(),
  Authorization: Joi.string().allow('').optional(),
})


const updateUserProfile = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  mobile: Joi.string()
    .min(5)
    .message('Mobile min length is 5')
    .max(10)
    .message('Mobile max length is 10')
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required'
    }),
  profileImage: Joi.string().allow('').optional(),
})

const updateCity = Joi.object({
  city_id: Joi.number().required(),
  Authorization: Joi.string().allow('').optional(),
})

const addCoupon = Joi.object({
  title: Joi.string().required(),
  code: Joi.string().required(),
  amount: Joi.number().required(),
  amountType: Joi.string().valid('percentage', 'fixed').required(),
  description: Joi.string().allow('').optional(),
  address: Joi.string().required(),
  city_id: Joi.number().required(),
  Authorization: Joi.string().allow('').optional(),
  couponLogo: Joi.string().allow('').optional(),
})

const addFeedback = Joi.object({
  description: Joi.string().required(),
  Authorization: Joi.string().allow('').optional(),
})

const addPackage = Joi.object({
  cityCount: Joi.number().required(),
  amount: Joi.number().required(),
  packageType: Joi.string().valid('monthly', 'yearly').required(),
  title: Joi.string().allow('').optional(),
  Authorization: Joi.string().allow('').optional(),
})

const userSubscribe = Joi.object({
  package_id: Joi.string().required(),
  Authorization: Joi.string().allow('').optional(),
})

module.exports = {
  addRole,
  updateCity,
  addPackage,
  userSubscribe,
  addCoupon,
  addFeedback,
  updateUserProfile,
  getRoleInfo,
  updateRole,
  addUser,
  getUsers,
  getUserInfo,
  updateUser,
  updateUserStatus,
  login,
  addVehicle,
  getVehicleInfo,
  getCities,
  updateVehicle,
  updateVehicleStatus,
  assignVehicle,
  getVehicleInfoAll,
  addClient,
  updateClient,
  deleteVehicle,
  deleteUser,
  updateConfig,
  signup,
  signin,
  changePassword,
  verifyOTP,
  updateProfile,
  addOwnVehicle,
  addChargingHistory,
  addVehicleService,
  getChargingHistories,
  updateProfileImage,
  updateStatus,
  updateProfileData,
  dropFromDealer,
  vehicleDownload,
  addInsuranceUser,
  updateInsuranceUser,
  getInsuranceUsers,
  getVehicleInfoPredction,
  getModelList,
  addVehicleModelController
}
