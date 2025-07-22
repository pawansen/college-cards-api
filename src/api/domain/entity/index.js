exports.selectedMarketsApiPayload = (req) => {
  let { event_type, competition, event } = req.body
  return {
    match_id: event.id,
    name: event.name,
    sport_name: event_type.name,
    sport_id: event_type.id,
    series_name: competition.name,
    series_id: competition.id,
    series_is_completed: 0,
    sport_is_active: 1,
    series_is_active: 1,
    is_active: 1,
    is_completed: 0,
    match_date: event.openDate,
  }
}
