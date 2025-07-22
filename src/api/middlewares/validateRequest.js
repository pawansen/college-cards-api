exports.addMarketRequest = () => async (req, res, next) => {
  let selected_api = ''
  if (req.body.selected_api != undefined && req.body.selected_api != '') {
    selected_api = req.body.selected_api
    delete req.body.selected_api
  }
  if (req.body.is_active == undefined) req.body.is_active = '0'
  if (req.body.is_manual == undefined) req.body.is_manual = '1'
  if (req.body.deletable == undefined) req.body.deletable = '0'
  if (req.body.is_result_declared == undefined)
    req.body.is_result_declared = '0'
  if (req.body.is_abandoned == undefined) req.body.is_abandoned = '0'
  let s_no = req.body.s_no != undefined ? req.body.s_no : 0
  if (req.body.s_no != undefined) delete req.body.s_no
  if (req.body.centralId == '' || req.body.centralId == undefined)
    delete req.body.centralId
  next()
}
