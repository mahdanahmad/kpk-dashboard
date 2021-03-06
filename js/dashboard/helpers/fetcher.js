// CHART
function getVizCategories(callback) { $.get( "api/cat", constructParams(), ( data ) => { cateValue = data.result; callback(data.result); }); }
function getVizMaps(prov_id, callback) { $.get( "api/map" + (prov_id ? '/' + prov_id : ''), constructParams(), ( data ) => {
	countessa[(prov_id) ? 'regencies' : 'provinces'] = _.chain(data.result).map((o) => ([o.id, o.count])).fromPairs().value();
	callback(null, data.result); }); }
function getVizTreemap(callback) { $.get( "api/treemap", constructParams(), ( data ) => { callback(data.result); }); }
function getVizVolume(time, callback) { $.get( "api/volume", _.assign({ time }, constructParams()), ( data ) => { callback(data.result); }); }
function getVizKeywords(limit, callback) { $.get( "api/keywords", _.assign({ limit }, constructParams()), ( data ) => { callback(data.result); }); }
function getVizBipartite(callback) { $.get( "api/bipartite", constructParams(), ( data ) => { callback(data.result); }); }
function getRaw(limit, offset, additional, callback) { $.get( "api/raw", _.assign({ limit, offset }, additional, constructParams()), ( data ) => { callback(data.result); }); }

// COMPONENT
function getProvinces(id, callback) { $.get( "api/provinces" + (id ? ('/' + id) : ''), (data) => { callback(data.result) }); }

// HELPER
function constructParams() { return _.omitBy({ categories: JSON.stringify(activeCate), startDate: activeDate.start, endDate: activeDate.end, province: centered, regency, datasource: $('#datasource > input').val() }, _.isNil); }
