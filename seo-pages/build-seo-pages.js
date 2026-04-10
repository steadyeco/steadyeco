#!/usr/bin/env node
/**
 * STEADY ECO — SEO PAGE GENERATOR
 * Generates 1,000+ static HTML pages for FNQ search domination.
 * Run: node seo-pages/build-seo-pages.js
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const TEMPLATE = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8')

// Enhanced content for top pages
let ENHANCED = {}
try { ENHANCED = require('./enhanced-content.js').ENHANCED || {} } catch(e) {}
const DOMAIN = 'https://steadyeco.com'
const PHONE = '0456 190 202'
const ABN = '49 553 784 085'

// ══════════════════════════════════════
// LOCATIONS (100)
// ══════════════════════════════════════

const LOCATIONS = [
  // TIER 1 — Cairns City (30)
  { slug: 'cairns-city', name: 'Cairns City', region: 'Cairns CBD', tier: 1, context: 'The commercial heart of Far North Queensland. Dense mix of businesses, apartments, and older residential properties. High foot traffic, strata-managed buildings, and council-maintained public spaces. Strong demand for commercial maintenance and tree management.', nearby: ['Cairns North', 'Parramatta Park', 'Bungalow'], distance: 'CBD', council: 'Cairns Regional Council' },
  { slug: 'cairns-north', name: 'Cairns North', region: 'Cairns Inner', tier: 1, context: 'Popular inner-city residential suburb between the CBD and Esplanade. Older Queenslander homes on smaller blocks with established tropical gardens. Palms and mango trees dominate. Regular garden maintenance and palm cleaning in high demand.', nearby: ['Cairns City', 'Edge Hill', 'Whitfield'], distance: '2km north', council: 'Cairns Regional Council' },
  { slug: 'bungalow', name: 'Bungalow', region: 'Cairns Inner', tier: 1, context: 'Established inner suburb south of the CBD. Mix of residential and light commercial. Older properties with overgrown gardens common. Affordable housing attracts renters — end-of-lease clean-ups frequent.', nearby: ['Portsmith', 'Westcourt', 'Parramatta Park'], distance: '2km south', council: 'Cairns Regional Council' },
  { slug: 'manunda', name: 'Manunda', region: 'Cairns Inner', tier: 1, context: 'Residential suburb with a mix of older homes and newer units. Stockland Cairns shopping centre nearby brings commercial maintenance needs. Established street trees and tropical gardens throughout.', nearby: ['Manoora', 'Mooroobool', 'Edge Hill'], distance: '3km west', council: 'Cairns Regional Council' },
  { slug: 'manoora', name: 'Manoora', region: 'Cairns Inner', tier: 1, context: 'Residential suburb with diverse housing. Social housing areas alongside private homes. Large public parks and school grounds require regular maintenance. Budget-friendly services in demand.', nearby: ['Manunda', 'Kanimbla', 'Mooroobool'], distance: '4km west', council: 'Cairns Regional Council' },
  { slug: 'mooroobool', name: 'Mooroobool', region: 'Cairns Inner', tier: 1, context: 'Hillside suburb with views over Cairns. Steep blocks with challenging access for mowing equipment. Tropical vegetation grows rapidly in the wet season. Ride-on mowing for larger sloped properties.', nearby: ['Manunda', 'Kanimbla', 'Whitfield'], distance: '4km west', council: 'Cairns Regional Council' },
  { slug: 'westcourt', name: 'Westcourt', region: 'Cairns Inner', tier: 1, context: 'Small inner suburb between the CBD and Bungalow. Compact blocks with established gardens. Close proximity means quick service turnaround. Mix of owner-occupied and rental properties.', nearby: ['Bungalow', 'Parramatta Park', 'Cairns City'], distance: '2km south', council: 'Cairns Regional Council' },
  { slug: 'parramatta-park', name: 'Parramatta Park', region: 'Cairns Inner', tier: 1, context: 'Inner-city residential area with character homes. Tree-lined streets with mature tropical plantings. Heritage-listed properties require sensitive tree work. Popular with families upgrading older homes.', nearby: ['Cairns City', 'Bungalow', 'Westcourt'], distance: '1km south', council: 'Cairns Regional Council' },
  { slug: 'portsmith', name: 'Portsmith', region: 'Cairns South', tier: 1, context: 'Industrial and commercial zone south of the CBD. Large warehouse lots, boat yards, and commercial properties. Vegetation management around industrial sites and road corridors. Commercial mowing contracts.', nearby: ['Bungalow', 'Woree', 'Earlville'], distance: '4km south', council: 'Cairns Regional Council' },
  { slug: 'earlville', name: 'Earlville', region: 'Cairns South', tier: 1, context: 'Major shopping precinct with Stockland Earlville. Surrounding residential areas have established tropical gardens. Body corporate maintenance for unit complexes. High-traffic commercial frontages need regular upkeep.', nearby: ['Woree', 'Bayview Heights', 'Portsmith'], distance: '5km south', council: 'Cairns Regional Council' },
  { slug: 'edge-hill', name: 'Edge Hill', region: 'Cairns Inner', tier: 1, context: 'Prestige inner suburb at the foot of the range. Botanic Gardens precinct. Large blocks with mature rainforest trees. Heritage character. Premium landscaping and careful tree work required. High property values.', nearby: ['Cairns North', 'Whitfield', 'Freshwater'], distance: '3km north', council: 'Cairns Regional Council' },
  { slug: 'whitfield', name: 'Whitfield', region: 'Cairns Inner', tier: 1, context: 'Hillside suburb backing onto rainforest reserve. Large properties with native vegetation encroaching from the range. Cassowary habitat nearby. Cyclone-prone trees need regular assessment. Premium suburb with high expectations.', nearby: ['Edge Hill', 'Brinsmead', 'Freshwater'], distance: '5km northwest', council: 'Cairns Regional Council' },
  { slug: 'brinsmead', name: 'Brinsmead', region: 'Cairns Western', tier: 1, context: 'Quiet residential suburb in the foothills. Mix of established homes and newer builds. Larger blocks than inner suburbs. Tropical fruit trees and native vegetation. Regular maintenance and green waste removal.', nearby: ['Whitfield', 'Freshwater', 'Kamerunga'], distance: '6km northwest', council: 'Cairns Regional Council' },
  { slug: 'freshwater', name: 'Freshwater', region: 'Cairns Western', tier: 1, context: 'Scenic suburb at the base of the Barron Gorge. Home to the Kuranda Scenic Railway station. Lush tropical vegetation with rapid growth in wet season. Large blocks backing onto national park. Our home base.', nearby: ['Edge Hill', 'Stratford', 'Redlynch'], distance: '7km northwest', council: 'Cairns Regional Council' },
  { slug: 'stratford', name: 'Stratford', region: 'Cairns North', tier: 1, context: 'Family-friendly suburb along the Captain Cook Highway. Mix of older and newer homes. Freshwater Creek runs through. Established gardens with palms, mangoes, and tropical plantings. Regular mowing and garden maintenance.', nearby: ['Freshwater', 'Cairns North', 'Aeroglen'], distance: '5km north', council: 'Cairns Regional Council' },
  { slug: 'aeroglen', name: 'Aeroglen', region: 'Cairns North', tier: 1, context: 'Small residential pocket near Cairns Airport. Compact suburb with well-maintained homes. Airport proximity means height restrictions on trees. Quick access from our base.', nearby: ['Stratford', 'Cairns North', 'Edge Hill'], distance: '4km north', council: 'Cairns Regional Council' },
  { slug: 'kanimbla', name: 'Kanimbla', region: 'Cairns Western', tier: 1, context: 'Hillside suburb with elevated blocks and views. Steep terrain makes mowing challenging — ride-on equipment essential for larger properties. Tropical vegetation grows aggressively in the wet. Storm damage common on exposed blocks.', nearby: ['Mooroobool', 'Manoora', 'Whitfield'], distance: '5km west', council: 'Cairns Regional Council' },
  { slug: 'bayview-heights', name: 'Bayview Heights', region: 'Cairns South', tier: 1, context: 'Established family suburb with views over Trinity Inlet. Medium-sized blocks with mature gardens. Growing demand for landscaping upgrades as older homes are renovated. Community-minded suburb.', nearby: ['Earlville', 'Woree', 'Mount Sheridan'], distance: '6km south', council: 'Cairns Regional Council' },
  { slug: 'kamerunga', name: 'Kamerunga', region: 'Cairns Western', tier: 1, context: 'Leafy western suburb along the Barron River. Large blocks with established tropical gardens and rainforest margins. Wildlife corridor area — cassowaries occasionally spotted. Sensitive vegetation management needed.', nearby: ['Freshwater', 'Redlynch', 'Caravonica'], distance: '8km northwest', council: 'Cairns Regional Council' },
  { slug: 'caravonica', name: 'Caravonica', region: 'Cairns Northern', tier: 1, context: 'Growing suburb at the base of the Skyrail terminal. New estates alongside established properties. Rainforest backdrop with rapid vegetation growth. Landscaping for new homes and maintenance for established gardens.', nearby: ['Smithfield', 'Redlynch', 'Kamerunga'], distance: '12km north', council: 'Cairns Regional Council' },
  { slug: 'redlynch', name: 'Redlynch', region: 'Cairns Western', tier: 1, context: 'Popular family suburb in the Redlynch Valley. Large estates, acreage properties, and newer developments. Surrounded by rainforest ranges. High demand for ride-on mowing, tree work, and vegetation management. One of our busiest service areas.', nearby: ['Freshwater', 'Kamerunga', 'Lake Placid'], distance: '10km northwest', council: 'Cairns Regional Council' },
  { slug: 'lake-placid', name: 'Lake Placid', region: 'Cairns Western', tier: 1, context: 'Quiet residential area near the Barron River. Medium to large blocks with tropical gardens. Lake Placid itself is a scenic centrepiece. Established homes needing regular garden maintenance and occasional tree work.', nearby: ['Redlynch', 'Caravonica', 'Kamerunga'], distance: '11km northwest', council: 'Cairns Regional Council' },
  { slug: 'barron-gorge', name: 'Barron Gorge', region: 'Cairns Western', tier: 1, context: 'Rainforest area surrounding Barron Gorge National Park. Acreage properties with dense native vegetation. Significant vegetation management needs. Wet Tropics World Heritage buffer zone — environmental sensitivity required.', nearby: ['Freshwater', 'Kuranda', 'Redlynch'], distance: '12km northwest', council: 'Cairns Regional Council' },
  { slug: 'smithfield', name: 'Smithfield', region: 'Cairns Northern', tier: 1, context: 'Rapidly growing northern suburb. James Cook University campus. Shopping centre. Mix of new estates and established homes. High demand for new garden establishment, regular mowing, and tree management around growing infrastructure.', nearby: ['Caravonica', 'Trinity Beach', 'Yorkeys Knob'], distance: '15km north', council: 'Cairns Regional Council' },
  { slug: 'edmonton', name: 'Edmonton', region: 'Cairns South', tier: 1, context: 'Southern growth corridor with new housing estates. Sugar cane fields transitioning to residential. Large blocks need establishing gardens and regular maintenance. Edmonton shopping village services a growing population.', nearby: ['Bentley Park', 'Mount Sheridan', 'Gordonvale'], distance: '12km south', council: 'Cairns Regional Council' },
  { slug: 'bentley-park', name: 'Bentley Park', region: 'Cairns South', tier: 1, context: 'Modern family suburb with newer homes on medium blocks. Growing fast with young families. Gardens still being established. Strong demand for regular mowing and new landscaping. Commercial growth creating maintenance opportunities.', nearby: ['Edmonton', 'Mount Sheridan', 'Woree'], distance: '13km south', council: 'Cairns Regional Council' },
  { slug: 'mount-sheridan', name: 'Mount Sheridan', region: 'Cairns South', tier: 1, context: 'Major southern suburb with Mount Sheridan Plaza. Elevated blocks with views. Larger properties need ride-on mowing. Established tropical gardens with mature trees. Body corporate complexes for regular maintenance.', nearby: ['Bentley Park', 'Edmonton', 'White Rock'], distance: '11km south', council: 'Cairns Regional Council' },
  { slug: 'woree', name: 'Woree', region: 'Cairns South', tier: 1, context: 'Southern suburb with Cairns Hospital precinct. Mix of residential and commercial. Older homes with established gardens. Hospital and medical precinct grounds need commercial maintenance. Accessible and close to major infrastructure.', nearby: ['Earlville', 'Bayview Heights', 'White Rock'], distance: '7km south', council: 'Cairns Regional Council' },
  { slug: 'white-rock', name: 'White Rock', region: 'Cairns South', tier: 1, context: 'Established southern suburb with views over Trinity Inlet. Medium blocks with tropical gardens. Mangrove areas nearby. Older homes being renovated — garden upgrades and tree removal for new builds.', nearby: ['Woree', 'Mount Sheridan', 'Bentley Park'], distance: '9km south', council: 'Cairns Regional Council' },
  { slug: 'gordonvale', name: 'Gordonvale', region: 'Cairns South', tier: 1, context: 'Sugar mill town at the base of Walsh Pyramid. Rural residential with large blocks and acreage. Sugar cane surrounds. Established tropical gardens and large trees. Strong demand for tree work, mowing, and vegetation clearing on rural properties.', nearby: ['Edmonton', 'Bentley Park', 'Babinda'], distance: '23km south', council: 'Cairns Regional Council' },

  // TIER 2 — Northern Beaches (12)
  { slug: 'holloways-beach', name: 'Holloways Beach', region: 'Northern Beaches', tier: 2, context: 'Quiet beachside suburb with salt-tolerant gardens. Coastal vegetation management. Sand-based soils affect plant growth. Holiday rentals need regular maintenance between guests.', nearby: ['Machans Beach', 'Yorkeys Knob', 'Smithfield'], distance: '12km north', council: 'Cairns Regional Council' },
  { slug: 'machans-beach', name: 'Machans Beach', region: 'Northern Beaches', tier: 2, context: 'Small coastal community with older character homes. Compact blocks near the shore. Paperbark and she-oak trees. Cyclone exposure means regular tree assessment.', nearby: ['Holloways Beach', 'Yorkeys Knob', 'Smithfield'], distance: '13km north', council: 'Cairns Regional Council' },
  { slug: 'yorkeys-knob', name: 'Yorkeys Knob', region: 'Northern Beaches', tier: 2, context: 'Marina village with mix of permanent residents and holiday homes. Larger blocks than inner beaches. Palm-lined streets. Boat-owning community with maintained properties. Resort-style body corporates.', nearby: ['Holloways Beach', 'Smithfield', 'Trinity Park'], distance: '15km north', council: 'Cairns Regional Council' },
  { slug: 'trinity-park', name: 'Trinity Park', region: 'Northern Beaches', tier: 2, context: 'Family suburb between Smithfield and Trinity Beach. Newer estates with established gardens. Good-sized blocks. Strong demand for regular mowing and garden maintenance. Growing commercial precinct.', nearby: ['Trinity Beach', 'Smithfield', 'Yorkeys Knob'], distance: '17km north', council: 'Cairns Regional Council' },
  { slug: 'trinity-beach', name: 'Trinity Beach', region: 'Northern Beaches', tier: 2, context: 'Popular residential beach suburb. Mix of families and retirees. Medium blocks with tropical gardens. Beachfront properties have high presentation standards. Regular maintenance for holiday rentals.', nearby: ['Trinity Park', 'Kewarra Beach', 'Smithfield'], distance: '18km north', council: 'Cairns Regional Council' },
  { slug: 'kewarra-beach', name: 'Kewarra Beach', region: 'Northern Beaches', tier: 2, context: 'Quieter northern beach suburb. Kewarra Beach Resort precinct. Tropical gardens with mature palms and native plantings. Premium residential area expecting high-quality maintenance.', nearby: ['Trinity Beach', 'Clifton Beach', 'Palm Cove'], distance: '20km north', council: 'Cairns Regional Council' },
  { slug: 'clifton-beach', name: 'Clifton Beach', region: 'Northern Beaches', tier: 2, context: 'Growing coastal suburb between Kewarra and Palm Cove. New developments alongside established homes. Tropical gardens with ocean views. High demand for landscaping new properties and maintaining established gardens.', nearby: ['Kewarra Beach', 'Palm Cove', 'Trinity Beach'], distance: '22km north', council: 'Cairns Regional Council' },
  { slug: 'palm-cove', name: 'Palm Cove', region: 'Northern Beaches', tier: 2, context: 'Premium tourism and luxury residential destination. Five-star resorts, boutique hotels, and high-end homes. Immaculate presentation expected. The melaleuca-lined esplanade is iconic. Premium landscaping and meticulous maintenance standards.', nearby: ['Clifton Beach', 'Ellis Beach', 'Kewarra Beach'], distance: '25km north', council: 'Cairns Regional Council' },
  { slug: 'ellis-beach', name: 'Ellis Beach', region: 'Northern Beaches', tier: 2, context: 'Small coastal settlement between Palm Cove and Port Douglas road. Beachfront properties with tropical gardens. Remote feel but accessible. Holiday homes need seasonal maintenance.', nearby: ['Palm Cove', 'Clifton Beach', 'Wangetti'], distance: '30km north', council: 'Cairns Regional Council' },
  { slug: 'buchan-point', name: 'Buchan Point', region: 'Northern Beaches', tier: 2, context: 'Small residential pocket near the coast. Limited properties but premium positioning. Tropical vegetation with ocean exposure. Cyclone preparation and storm clean-up services.', nearby: ['Ellis Beach', 'Palm Cove'], distance: '28km north', council: 'Cairns Regional Council' },
  { slug: 'mount-peter', name: 'Mount Peter', region: 'Cairns South', tier: 2, context: 'New master-planned community south of Edmonton. Brand new homes on medium blocks. Gardens being established from scratch. Strong demand for landscaping, turf laying, and garden establishment.', nearby: ['Edmonton', 'Gordonvale', 'Bentley Park'], distance: '18km south', council: 'Cairns Regional Council' },

  // TIER 4 — Tablelands (15)
  { slug: 'atherton', name: 'Atherton', region: 'Atherton Tablelands', tier: 4, context: 'Service hub of the Atherton Tablelands. Agricultural heartland — orchards, dairy farms, and rural residential. Cooler climate than coastal Cairns. Large properties with significant mowing and vegetation management needs.', nearby: ['Mareeba', 'Yungaburra', 'Tolga'], distance: '80km southwest', council: 'Tablelands Regional Council' },
  { slug: 'mareeba', name: 'Mareeba', region: 'Atherton Tablelands', tier: 4, context: 'Western Tablelands hub. Large blocks, rural properties, and commercial/industrial areas. Coffee, mango, and avocado farms. Hot and dry compared to coast. Significant vegetation clearing and land management work.', nearby: ['Atherton', 'Kuranda', 'Dimbulah'], distance: '60km west', council: 'Mareeba Shire Council' },
  { slug: 'kuranda', name: 'Kuranda', region: 'Atherton Tablelands', tier: 4, context: 'Rainforest village above Cairns. Tourist destination with Kuranda Markets. Properties surrounded by World Heritage rainforest. Extremely sensitive vegetation management — Wet Tropics regulations apply. Dense tropical growth year-round.', nearby: ['Speewah', 'Caravonica', 'Mareeba'], distance: '25km northwest', council: 'Mareeba Shire Council' },
  { slug: 'yungaburra', name: 'Yungaburra', region: 'Atherton Tablelands', tier: 4, context: 'Heritage village on the Tablelands. Platypus-watching town. Established gardens with mature trees. Cooler climate supports different plant species than the coast. Heritage homes need sensitive tree work.', nearby: ['Atherton', 'Malanda', 'Lake Eacham'], distance: '75km southwest', council: 'Tablelands Regional Council' },
  { slug: 'malanda', name: 'Malanda', region: 'Atherton Tablelands', tier: 4, context: 'Dairy country on the southern Tablelands. High rainfall area with lush green pastures. Large rural properties. Fencing lines need vegetation clearing. Farm maintenance and rural property upkeep.', nearby: ['Yungaburra', 'Millaa Millaa', 'Atherton'], distance: '85km southwest', council: 'Tablelands Regional Council' },
  { slug: 'millaa-millaa', name: 'Millaa Millaa', region: 'Atherton Tablelands', tier: 4, context: 'Famous waterfall circuit town. Dense rainforest surrounds. High rainfall — vegetation grows extremely fast. Rural properties with significant clearing needs. Remote but accessible.', nearby: ['Malanda', 'Ravenshoe', 'Innisfail'], distance: '95km south', council: 'Tablelands Regional Council' },
  { slug: 'ravenshoe', name: 'Ravenshoe', region: 'Atherton Tablelands', tier: 4, context: 'Highest town in Queensland. Cooler climate with frost risk. Pine plantations and eucalypt forests. Different vegetation management needs than tropical coast. Rural and semi-rural properties.', nearby: ['Atherton', 'Herberton', 'Mount Garnet'], distance: '95km southwest', council: 'Tablelands Regional Council' },
  { slug: 'tolga', name: 'Tolga', region: 'Atherton Tablelands', tier: 4, context: 'Small Tablelands town between Atherton and Mareeba. Agricultural focus — peanuts, maize. Quiet residential area with large blocks. Regular property maintenance for rural homes.', nearby: ['Atherton', 'Mareeba', 'Kairi'], distance: '70km west', council: 'Tablelands Regional Council' },
  { slug: 'kairi', name: 'Kairi', region: 'Atherton Tablelands', tier: 4, context: 'Tiny Tablelands settlement near Lake Tinaroo. Rural residential with very large blocks. Dam-side properties with lakefront vegetation. Peaceful farming community.', nearby: ['Tolga', 'Atherton', 'Yungaburra'], distance: '75km west', council: 'Tablelands Regional Council' },
  { slug: 'herberton', name: 'Herberton', region: 'Atherton Tablelands', tier: 4, context: 'Historic mining town on the Tablelands. Heritage buildings and established gardens. Older population with maintained properties. Cool climate gardens with different species to the coast.', nearby: ['Atherton', 'Ravenshoe', 'Walkamin'], distance: '85km southwest', council: 'Tablelands Regional Council' },
  { slug: 'walkamin', name: 'Walkamin', region: 'Atherton Tablelands', tier: 4, context: 'Small farming community on the Tablelands. Agricultural research station nearby. Large rural blocks with orchards and farming infrastructure. Vegetation management around farm boundaries.', nearby: ['Tolga', 'Atherton', 'Mareeba'], distance: '72km west', council: 'Tablelands Regional Council' },
  { slug: 'dimbulah', name: 'Dimbulah', region: 'Atherton Tablelands', tier: 4, context: 'Western Tablelands farming town. Hot dry climate. Tobacco and mango farms. Large cleared properties needing regular maintenance. Remote but within our service radius.', nearby: ['Mareeba', 'Mount Molloy', 'Walkamin'], distance: '100km west', council: 'Mareeba Shire Council' },
  { slug: 'mount-garnet', name: 'Mount Garnet', region: 'Atherton Tablelands', tier: 4, context: 'Remote Tablelands mining town. Very large rural properties. Dry savannah vegetation. Land clearing and property maintenance for pastoral properties. Edge of our service area.', nearby: ['Ravenshoe', 'Herberton', 'Atherton'], distance: '120km southwest', council: 'Tablelands Regional Council' },
  { slug: 'speewah', name: 'Speewah', region: 'Cairns Western', tier: 4, context: 'Rural residential area between Cairns and Kuranda. Acreage properties in the foothills. Dense tropical vegetation. Popular with lifestyle block owners. Significant mowing and vegetation management on large properties.', nearby: ['Kuranda', 'Redlynch', 'Koah'], distance: '20km northwest', council: 'Mareeba Shire Council' },
  { slug: 'koah', name: 'Koah', region: 'Cairns Western', tier: 4, context: 'Rural community on the Kuranda Range road. Large acreage blocks with tropical and dry forest mix. Horse properties and hobby farms. Regular slashing and vegetation management needed.', nearby: ['Speewah', 'Kuranda', 'Mareeba'], distance: '25km west', council: 'Mareeba Shire Council' },

  // TIER 5 — Douglas Shire (10)
  { slug: 'port-douglas', name: 'Port Douglas', region: 'Douglas Shire', tier: 5, context: 'Premium tourism destination. Five-star resorts, luxury homes, and high-end holiday rentals. Immaculate presentation is non-negotiable. Tropical gardens with resort-standard maintenance. High spending power.', nearby: ['Mossman', 'Palm Cove', 'Daintree'], distance: '65km north', council: 'Douglas Shire Council' },
  { slug: 'mossman', name: 'Mossman', region: 'Douglas Shire', tier: 5, context: 'Sugar mill town and Douglas Shire service centre. Mix of residential and agricultural. Large blocks with cane fields nearby. Mossman Gorge entrance. Practical services for working families.', nearby: ['Port Douglas', 'Daintree', 'Julatten'], distance: '75km north', council: 'Douglas Shire Council' },
  { slug: 'daintree', name: 'Daintree', region: 'Douglas Shire', tier: 5, context: 'World Heritage rainforest village. Eco-tourism lodges and remote properties. Extremely sensitive vegetation management — World Heritage regulations. Dense tropical rainforest with rapid regrowth.', nearby: ['Mossman', 'Cape Tribulation', 'Port Douglas'], distance: '100km north', council: 'Douglas Shire Council' },
  { slug: 'cape-tribulation', name: 'Cape Tribulation', region: 'Douglas Shire', tier: 5, context: 'Where the rainforest meets the reef. Remote eco-lodges and tourist accommodation. Extremely limited access — 4WD in wet season. Specialised vegetation management for eco-tourism operators.', nearby: ['Daintree', 'Mossman'], distance: '140km north', council: 'Douglas Shire Council' },
  { slug: 'wonga-beach', name: 'Wonga Beach', region: 'Douglas Shire', tier: 5, context: 'Quiet coastal settlement north of Port Douglas. Beachfront properties with tropical gardens. Relaxed lifestyle block community. Regular maintenance for holiday homes.', nearby: ['Port Douglas', 'Mossman', 'Newell Beach'], distance: '70km north', council: 'Douglas Shire Council' },
  { slug: 'cooya-beach', name: 'Cooya Beach', region: 'Douglas Shire', tier: 5, context: 'Small beachside community near Port Douglas. Indigenous community with cultural significance. Coastal vegetation management. Mangrove and beach-front properties.', nearby: ['Port Douglas', 'Mossman'], distance: '68km north', council: 'Douglas Shire Council' },
  { slug: 'newell-beach', name: 'Newell Beach', region: 'Douglas Shire', tier: 5, context: 'Small coastal settlement near the Daintree River mouth. Cane fields behind beach. Quiet residential with holiday homes. Tropical gardens needing regular upkeep.', nearby: ['Wonga Beach', 'Mossman', 'Daintree'], distance: '80km north', council: 'Douglas Shire Council' },
  { slug: 'miallo', name: 'Miallo', region: 'Douglas Shire', tier: 5, context: 'Rural area between Mossman and Daintree. Cane farming country. Large rural residential blocks. Vegetation clearing and rural property maintenance.', nearby: ['Mossman', 'Daintree', 'Newell Beach'], distance: '85km north', council: 'Douglas Shire Council' },
  { slug: 'julatten', name: 'Julatten', region: 'Douglas Shire', tier: 5, context: 'Hinterland area above Port Douglas. Acreage properties and hobby farms. Rainforest and dry forest mix. Birdwatching destination. Larger property maintenance and vegetation management.', nearby: ['Mount Molloy', 'Mossman', 'Port Douglas'], distance: '80km north', council: 'Douglas Shire Council' },
  { slug: 'mount-molloy', name: 'Mount Molloy', region: 'Douglas Shire', tier: 5, context: 'Small township on the road to the Tablelands. Rural properties and cattle country. Dry woodland vegetation. Land clearing and rural property maintenance.', nearby: ['Julatten', 'Mareeba', 'Mossman'], distance: '75km northwest', council: 'Douglas Shire Council' },

  // TIER 6 — Cassowary Coast (12)
  { slug: 'innisfail', name: 'Innisfail', region: 'Cassowary Coast', tier: 6, context: 'Art Deco town and banana capital of Australia. Highest rainfall in the country. Vegetation grows at incredible rates. Commercial district and surrounding residential. Major service centre south of Cairns.', nearby: ['Mission Beach', 'Babinda', 'Tully'], distance: '90km south', council: 'Cassowary Coast Regional Council' },
  { slug: 'mission-beach', name: 'Mission Beach', region: 'Cassowary Coast', tier: 6, context: 'Beachfront tourist destination. Cassowary habitat — World Heritage adjacent. Eco-lodges and holiday rentals. Premium tropical gardens needing sensitive maintenance. Cyclone-prone coastline.', nearby: ['Innisfail', 'Tully', 'South Mission Beach'], distance: '140km south', council: 'Cassowary Coast Regional Council' },
  { slug: 'tully', name: 'Tully', region: 'Cassowary Coast', tier: 6, context: 'Wettest town in Australia. Sugar cane and banana farming. Extreme vegetation growth. Properties need constant maintenance. Mould and moisture affect gardens. Commercial and residential.', nearby: ['Innisfail', 'Mission Beach', 'El Arish'], distance: '140km south', council: 'Cassowary Coast Regional Council' },
  { slug: 'el-arish', name: 'El Arish', region: 'Cassowary Coast', tier: 6, context: 'Small farming community near Mission Beach. Rural residential with tropical gardens. Dense vegetation surrounds. Quiet community with regular maintenance needs.', nearby: ['Mission Beach', 'Tully', 'Innisfail'], distance: '130km south', council: 'Cassowary Coast Regional Council' },
  { slug: 'cardwell', name: 'Cardwell', region: 'Cassowary Coast', tier: 6, context: 'Coastal town with views to Hinchinbrook Island. Cyclone Yasi rebuilding. Foreshore properties with salt-tolerant gardens. Tourism base for Hinchinbrook Channel.', nearby: ['Tully', 'Ingham', 'Mission Beach'], distance: '170km south', council: 'Cassowary Coast Regional Council' },
  { slug: 'south-mission-beach', name: 'South Mission Beach', region: 'Cassowary Coast', tier: 6, context: 'Southern extension of Mission Beach. Quieter residential area. Cassowary habitat with strict vegetation rules. Tropical gardens backing onto rainforest.', nearby: ['Mission Beach', 'Wongaling Beach', 'El Arish'], distance: '145km south', council: 'Cassowary Coast Regional Council' },
  { slug: 'wongaling-beach', name: 'Wongaling Beach', region: 'Cassowary Coast', tier: 6, context: 'Commercial centre of the Mission Beach area. Shopping village and accommodation. Body corporate maintenance for resort units. Tropical gardens with high growth rates.', nearby: ['Mission Beach', 'South Mission Beach', 'El Arish'], distance: '142km south', council: 'Cassowary Coast Regional Council' },
  { slug: 'silkwood', name: 'Silkwood', region: 'Cassowary Coast', tier: 6, context: 'Small sugar cane town south of Innisfail. Rural residential. Large blocks with cane fields. Basic maintenance and vegetation management services.', nearby: ['Innisfail', 'Mena Creek', 'Tully'], distance: '110km south', council: 'Cassowary Coast Regional Council' },
  { slug: 'mena-creek', name: 'Mena Creek', region: 'Cassowary Coast', tier: 6, context: 'Tiny settlement near Paronella Park. Heritage tourism area. Rainforest surrounds with dense tropical vegetation. Specialty vegetation management for tourism operators.', nearby: ['Innisfail', 'Silkwood'], distance: '100km south', council: 'Cassowary Coast Regional Council' },
  { slug: 'flying-fish-point', name: 'Flying Fish Point', region: 'Cassowary Coast', tier: 6, context: 'Coastal settlement near Innisfail. Fishing village atmosphere. Waterfront properties with coastal gardens. Small community with seasonal maintenance needs.', nearby: ['Innisfail', 'Babinda'], distance: '95km south', council: 'Cassowary Coast Regional Council' },
  { slug: 'babinda', name: 'Babinda', region: 'Cassowary Coast', tier: 6, context: 'Small sugar town south of Gordonvale. Babinda Boulders tourist attraction. Very high rainfall. Lush tropical gardens. Older homes with established vegetation. Regular maintenance essential in the wet.', nearby: ['Gordonvale', 'Innisfail', 'Mena Creek'], distance: '60km south', council: 'Cairns Regional Council' },
  { slug: 'mossman-gorge', name: 'Mossman Gorge', region: 'Douglas Shire', tier: 6, context: 'Gateway to the Daintree. Indigenous cultural centre. World Heritage rainforest. Extremely sensitive vegetation management with cultural and environmental considerations.', nearby: ['Mossman', 'Port Douglas', 'Daintree'], distance: '80km north', council: 'Douglas Shire Council' },

  // TIER 7 — Hinchinbrook (8)
  { slug: 'ingham', name: 'Ingham', region: 'Hinchinbrook', tier: 7, context: 'Sugar cane town and Hinchinbrook Shire service centre. Large rural properties. Italian heritage community with well-maintained gardens. Commercial main street. Edge of our regular service area.', nearby: ['Halifax', 'Lucinda', 'Cardwell'], distance: '110km south of Cairns via Bruce Highway', council: 'Hinchinbrook Shire Council' },
  { slug: 'halifax', name: 'Halifax', region: 'Hinchinbrook', tier: 7, context: 'Small township near Ingham. Rural residential. Cane farming surrounds. Basic maintenance services for rural properties.', nearby: ['Ingham', 'Lucinda'], distance: '120km south', council: 'Hinchinbrook Shire Council' },
  { slug: 'lucinda', name: 'Lucinda', region: 'Hinchinbrook', tier: 7, context: 'Coastal town with longest jetty in the southern hemisphere. Fishing village with holiday homes. Waterfront properties needing cyclone preparation and coastal vegetation maintenance.', nearby: ['Ingham', 'Halifax'], distance: '130km south', council: 'Hinchinbrook Shire Council' },
  { slug: 'forrest-beach', name: 'Forrest Beach', region: 'Hinchinbrook', tier: 7, context: 'Small beach community near Ingham. Holiday homes and permanent residents. Coastal gardens with salt exposure. Seasonal maintenance demand.', nearby: ['Ingham', 'Halifax'], distance: '125km south', council: 'Hinchinbrook Shire Council' },

  // TIER 8 — Remote (5)
  { slug: 'cooktown', name: 'Cooktown', region: 'Cape York', tier: 8, context: 'Historic town at the tip of the sealed road north. Remote but growing tourism. Government facilities and residential. Long travel distance — project-based work rather than regular maintenance.', nearby: ['Lakeland', 'Laura'], distance: '330km north', council: 'Cook Shire Council' },
  { slug: 'lakeland', name: 'Lakeland', region: 'Cape York', tier: 8, context: 'Crossroads town between Cairns-Cooktown and Peninsula Developmental Road. Small agricultural community. Remote rural maintenance.', nearby: ['Cooktown', 'Laura', 'Mareeba'], distance: '260km north', council: 'Cook Shire Council' },
  { slug: 'weipa', name: 'Weipa', region: 'Cape York', tier: 8, context: 'Mining town on the western Cape York coast. Rio Tinto bauxite operations. Fly-in-fly-out workforce. Government contracts for vegetation management around mining infrastructure. Remote — project-based only.', nearby: ['Cooktown'], distance: '800km north (fly only)', council: 'Cook Shire Council' },
]

// ══════════════════════════════════════
// SERVICES (8)
// ══════════════════════════════════════

const SERVICES = [
  { slug: 'tree-removal', name: 'Tree Removal', desc: 'Professional tree removal and lopping across Far North Queensland. Safe, efficient, complete clean-up.' },
  { slug: 'tree-pruning', name: 'Tree Pruning', desc: 'Expert tree pruning, trimming, and crown reduction. Promoting healthy growth and reducing risk.' },
  { slug: 'landscaping', name: 'Landscaping', desc: 'Complete landscaping services — garden design, construction, renovation, and ongoing maintenance.' },
  { slug: 'lawn-mowing', name: 'Lawn Mowing', desc: 'Regular lawn mowing and garden maintenance. Ride-on mowing for large properties and acreage.' },
  { slug: 'vegetation-management', name: 'Vegetation Management', desc: 'Land clearing, weed control, and vegetation management for residential, commercial, and government.' },
  { slug: 'blade-sharpening', name: 'Blade Sharpening', desc: 'Chipper blade sharpening to factory spec. $120 per set, 1-2 day turnaround. FNQ only local specialist.' },
  { slug: 'land-clearing', name: 'Land Clearing', desc: 'Block clearing, site preparation, and acreage clearing for development and agriculture.' },
  { slug: 'chipping-mulching', name: 'Chipping & Mulching', desc: 'On-site wood chipping and mulching. Green waste converted to mulch or removed with tipper truck.' },
]

// ══════════════════════════════════════
// CONTENT GENERATION
// ══════════════════════════════════════

function generateMetaDesc(service, location) {
  return `${service.name} in ${location.name}, FNQ. 7 years experience. Tipper, chipper, ride-on mower. Free quotes — call 0456 190 202.`.substring(0, 155)
}

function generateHero(service, location) {
  return `Professional ${service.name.toLowerCase()} in ${location.name} and surrounding areas. Steady Eco brings 7 years of hands-on experience, a tipper truck, wood chipper, ride-on mower, and chainsaws to every job. Serving ${location.region} with same-week response on all enquiries.`
}

function generateLocalContext(service, location) {
  return `<p>${location.context}</p><p>Steady Eco provides ${service.name.toLowerCase()} services throughout ${location.name} and the broader ${location.region} area. Based in Cairns (${location.distance}), we bring professional equipment and 7 years of hands-on trade experience to every job. Whether you need a one-off service or regular ongoing maintenance, we respond to all enquiries within one business day.</p>`
}

function generateProcessSteps(service) {
  const steps = {
    'tree-removal': [
      { title: 'Assessment & Quote', body: 'We assess the tree, check access, proximity to structures and power lines, and provide a clear written quote. No surprises.' },
      { title: 'Safe Removal', body: 'Professional removal with the right equipment. We section the tree safely, chip the branches on-site, and load everything onto the tipper.' },
      { title: 'Complete Clean-Up', body: 'Stump left flush or ground out. All debris removed. Your property is left clean and clear, ready for whatever comes next.' }
    ],
    'tree-pruning': [
      { title: 'Assess & Plan', body: 'We inspect the tree, identify what needs pruning, and plan the approach. Crown reduction, deadwooding, clearance — we explain what and why.' },
      { title: 'Precision Pruning', body: 'Careful cuts that promote healthy regrowth. We follow best practice to protect the tree while achieving your goals.' },
      { title: 'Clean & Chip', body: 'All branches chipped on-site. Mulch spread on your garden beds or removed with the tipper. Your property left tidy.' }
    ],
    'landscaping': [
      { title: 'Consult & Quote', body: 'Tell us what you need — garden renovation, new establishment, ongoing maintenance. We scope the job and provide a clear quote.' },
      { title: 'Design & Build', body: 'From garden beds and mulching to full landscape construction. We bring the equipment and materials to transform your outdoor space.' },
      { title: 'Maintain & Grow', body: 'Regular maintenance keeps your investment looking its best. Fortnightly or weekly schedules available.' }
    ],
    'lawn-mowing': [
      { title: 'Book Your Service', body: 'Tell us your property size, how often you need mowing, and any specific requirements. We quote within one business day.' },
      { title: 'Mow & Edge', body: 'We arrive on schedule with the right equipment — ride-on for large properties, push mower for detail work. Edges trimmed, paths blown clean.' },
      { title: 'Regular Schedule', body: 'Set and forget. We come on your scheduled day, do the job properly, and leave your lawn looking sharp every time.' }
    ],
    'vegetation-management': [
      { title: 'Site Assessment', body: 'We inspect the site, identify vegetation types, assess access, and plan the approach. For council work, we provide formal scope documentation.' },
      { title: 'Clear & Manage', body: 'Systematic clearing using chipper, ride-on mower, and chainsaws. We work efficiently and safely, managing waste as we go.' },
      { title: 'Removal & Report', body: 'All green waste chipped and removed with the tipper. Site left clean. For government contracts, we provide completion documentation.' }
    ],
    'blade-sharpening': [
      { title: 'Send or Drop Off', body: 'Drop your blades at our Cairns base (free) or arrange pickup and return from $10. Tell us the machine make so we have the angle on file.' },
      { title: 'Precision Grinding', body: 'Every blade sharpened to factory specification using electromagnetic chuck technology. Coolant-controlled to prevent heat damage. Set heights matched within 0.005".' },
      { title: 'Collect & Cut', body: 'Most jobs ready next business day. Pick up your factory-spec blades and get back to work. $120 per set, no surprises.' }
    ],
    'land-clearing': [
      { title: 'Scope & Quote', body: 'We assess the block, measure the area, identify vegetation types, and provide a clear quote. Council requirements checked if applicable.' },
      { title: 'Clear & Chip', body: 'Systematic clearing with chipper and chainsaws. Trees felled safely, branches chipped, debris loaded onto the tipper.' },
      { title: 'Site Ready', body: 'Block cleared to your requirements. All waste removed. Site left ready for building, landscaping, or whatever comes next.' }
    ],
    'chipping-mulching': [
      { title: 'Arrange Service', body: 'Tell us what needs chipping — storm debris, pruning waste, cleared vegetation. We bring the chipper and tipper to your site.' },
      { title: 'Chip On-Site', body: 'Our commercial wood chipper processes branches and vegetation into clean mulch. Fast, efficient, and contained.' },
      { title: 'Mulch or Remove', body: 'Fresh mulch spread on your garden beds for free — or loaded onto the tipper and taken away. Your choice.' }
    ],
  }
  return steps[service.slug] || steps['landscaping']
}

function generateWhyChoose(service, location) {
  return [
    '7 years hands-on experience in tree work and landscaping, trained under TRIMSNQ — an established FNQ business',
    `Local Cairns operator servicing ${location.name} and surrounding areas within our 100km service radius`,
    'Fully equipped — tipper truck, wood chipper, ride-on mower, chainsaws, and whipper snippers on every job',
    'Same-week response on all enquiries. We quote within one business day and show up when we say we will',
    'Complete clean-up guaranteed. We take all green waste with us — your property is left better than we found it',
    'Free quotes with no obligation. Honest pricing, no hidden fees, no surprises on the invoice'
  ]
}

function generateFAQs(service, location) {
  const sSlug = service.slug
  const sName = service.name.toLowerCase()

  // Service-aware equipment descriptions
  const equipDesc = {
    'tree-removal': 'tipper truck for waste removal, commercial wood chipper, chainsaws, and rigging equipment for safe sectional removal',
    'tree-pruning': 'commercial wood chipper, pruning saws, pole saws, and chainsaws for precision cuts at any height',
    'landscaping': 'tipper truck, ride-on mower, whipper snippers, and all hand tools for garden construction and maintenance',
    'lawn-mowing': 'ride-on mower for large properties, push mower for detail work, whipper snippers for edging, and a blower for clean paths',
    'vegetation-management': 'tipper truck, commercial wood chipper, ride-on mower for broad clearing, chainsaws, and brush cutters',
    'blade-sharpening': 'electromagnetic chuck grinder, coolant system, precision dial gauges, and angle-specific jigs for every blade type',
    'land-clearing': 'tipper truck, commercial wood chipper, chainsaws, and ride-on mower for broad site clearing',
    'chipping-mulching': 'commercial wood chipper and tipper truck for on-site processing and waste removal',
  }

  // Service-aware emergency line
  const emergencyLine = (sSlug === 'tree-removal' || sSlug === 'tree-pruning' || sSlug === 'vegetation-management' || sSlug === 'land-clearing')
    ? ` For emergency work after storms, we prioritise same-day response where possible.`
    : ''

  return [
    { q: `How much does ${sName} cost in ${location.name}?`, a: `${service.name} pricing in ${location.name} depends on the scope of work — property size, vegetation type, access, and complexity. We provide free, no-obligation quotes within one business day. Call 0456 190 202 or use our online quote tool for a fast response.` },
    { q: `How quickly can you start ${sName} work in ${location.name}?`, a: `We respond to all enquiries within one business day and can typically schedule work within the same week for ${location.name}.${emergencyLine}` },
    { q: `What equipment do you bring for ${sName} in ${location.name}?`, a: `Every job gets the right equipment — ${equipDesc[sSlug] || equipDesc['landscaping']}. We arrive fully equipped so there are no delays.` },
    { q: `Do you service ${location.name} regularly?`, a: `Yes. ${location.name} is within our regular service area (${location.distance} from our Cairns base). We service ${location.region} including nearby areas like ${location.nearby.slice(0, 3).join(', ')}. Regular maintenance schedules available.` },
    { q: `Do you remove all the green waste in ${location.name}?`, a: `Yes. Complete clean-up is included on every job. All green waste is either chipped into mulch for your garden beds or loaded onto our tipper truck and removed from your ${location.name} property. We leave your site clean.` },
    { q: `Are you insured for ${sName} in ${location.name}?`, a: `We carry appropriate insurance for all work. Our 7 years of hands-on experience means we know how to work safely and efficiently. We are a registered business (ABN ${ABN}) based in Cairns.` },
  ]
}

function generateRelated(service, location, allLocations, allServices) {
  const sameService = allLocations.filter(l => l.slug !== location.slug).slice(0, 3).map(l => ({
    url: `/services/${service.slug}/${l.slug}/`, label: `${service.name} ${l.name}`
  }))
  const sameLocation = allServices.filter(s => s.slug !== service.slug).slice(0, 3).map(s => ({
    url: `/services/${s.slug}/${location.slug}/`, label: `${s.name} ${location.name}`
  }))
  return [...sameService, ...sameLocation]
}

// ══════════════════════════════════════
// BUILD ENGINE
// ══════════════════════════════════════

let built = 0
let sitemapUrls = []

function buildPage(url, pageData) {
  const dir = path.join(ROOT, url)
  const file = path.join(dir, 'index.html')

  // Skip if page already exists (don't overwrite hand-built pages)
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8')
    if (!content.includes('PAGE_DATA_INJECT') && !content.includes('window.__PAGE__')) {
      return // Hand-built page, skip
    }
  }

  fs.mkdirSync(dir, { recursive: true })

  // Inject page data and set static meta tags
  let html = TEMPLATE
    .replace('<!-- PAGE_DATA_INJECT -->', `<script>window.__PAGE__=${JSON.stringify(pageData)};</script>`)

  // Set static title and meta for SEO (JS also sets these but crawlers need static)
  html = html.replace(
    '<title id="se-title">Steady Eco — FNQ Landscaping & Tree Work</title>',
    `<title id="se-title">${pageData.metaTitle}</title>`
  )
  html = html.replace(
    '<meta id="se-desc" name="description" content="">',
    `<meta id="se-desc" name="description" content="${pageData.metaDescription}">`
  )
  html = html.replace(
    '<link id="se-canonical" rel="canonical" href="">',
    `<link id="se-canonical" rel="canonical" href="${DOMAIN}${url}">`
  )

  fs.writeFileSync(file, html, 'utf8')
  sitemapUrls.push(url)
  built++
}

// ── BUILD SERVICE + LOCATION PAGES ──
console.log('\n🌿 STEADY ECO — SEO BUILD ENGINE')
console.log('━'.repeat(50))

LOCATIONS.forEach(location => {
  SERVICES.forEach(service => {
    const url = `/services/${service.slug}/${location.slug}`
    const eKey = `${service.slug}/${location.slug}`
    const e = ENHANCED[eKey] || {}
    const pageData = {
      type: 'service-location',
      url: url + '/',
      metaTitle: `${service.name} ${location.name} | Steady Eco FNQ`,
      metaDescription: generateMetaDesc(service, location),
      h1: `${service.name} in ${location.name}`,
      heroParagraph: e.heroParagraph || generateHero(service, location),
      service: service.name,
      serviceSlug: service.slug,
      location: location.name,
      quoteHeadline: `Get a Free ${service.name} Quote in ${location.name}`,
      breadcrumbs: [
        { label: 'Home', url: '/' },
        { label: service.name, url: `/services/${service.slug}/` },
        { label: location.name }
      ],
      sections: [
        { type: 'text', h2: `${service.name} in ${location.name}`, body: e.localContext || generateLocalContext(service, location) },
        { type: 'process', h2: 'How It Works', steps: e.processSteps || generateProcessSteps(service), surface: false },
        { type: 'why', h2: `Why Choose Steady Eco in ${location.name}`, bullets: generateWhyChoose(service, location), surface: true },
        { type: 'area', h2: `Serving ${location.region}`, body: `Steady Eco services ${location.name} (${location.distance} from Cairns) and surrounding areas including ${location.nearby.join(', ')}. We cover a 100km radius from our Cairns base across all of Far North Queensland.`, locations: location.nearby, surface: true },
        { type: 'faq', h2: `${service.name} FAQ — ${location.name}`, items: e.faqs || generateFAQs(service, location) },
      ],
      relatedPages: generateRelated(service, location, LOCATIONS, SERVICES)
    }
    buildPage(url, pageData)
  })
})
console.log(`  ✓ Service + Location pages: ${built}`)

// ── BUILD LOCATION HUB PAGES ──
const beforeLocHubs = built
LOCATIONS.forEach(location => {
  const url = `/locations/${location.slug}`
  const pageData = {
    type: 'location-hub',
    url: url + '/',
    metaTitle: `${location.name} Services | Steady Eco FNQ`,
    metaDescription: `All Steady Eco services in ${location.name} — tree work, landscaping, mowing, vegetation management, blade sharpening. Free quotes. Call 0456 190 202.`.substring(0, 155),
    h1: `Steady Eco Services in ${location.name}`,
    heroParagraph: `Professional landscaping, tree work, mowing, vegetation management, and blade sharpening in ${location.name}. ${location.context}`,
    location: location.name,
    quoteHeadline: `Get a Free Quote in ${location.name}`,
    breadcrumbs: [
      { label: 'Home', url: '/' },
      { label: 'Locations', url: '/locations/' },
      { label: location.name }
    ],
    sections: [
      { type: 'services', h2: `Services Available in ${location.name}`, surface: true, items: SERVICES.map(s => ({ name: s.name, desc: s.desc, url: `/services/${s.slug}/${location.slug}/` })) },
      { type: 'text', h2: `About ${location.name}`, body: `<p>${location.context}</p><p>Steady Eco serves ${location.name} from our Cairns base (${location.distance}). We bring a tipper truck, wood chipper, ride-on mower, and chainsaws to every job across ${location.region}.</p>` },
      { type: 'area', h2: 'Nearby Areas We Service', body: `We also service these areas near ${location.name}:`, locations: location.nearby, surface: true },
    ],
    relatedPages: LOCATIONS.filter(l => l.slug !== location.slug && l.region === location.region).slice(0, 6).map(l => ({ url: `/locations/${l.slug}/`, label: l.name }))
  }
  buildPage(url, pageData)
})
console.log(`  ✓ Location Hub pages: ${built - beforeLocHubs}`)

// ── BUILD KEYWORD VARIATION PAGES (Tier 1+2 only) ──
const VARIATIONS = {
  'tree-removal': ['tree-lopping', 'tree-cutting', 'tree-felling', 'dead-tree-removal', 'palm-tree-removal', 'emergency-tree-removal', 'hazardous-tree-removal'],
  'tree-pruning': ['tree-trimming', 'crown-reduction', 'branch-removal', 'hedge-trimming', 'arborist-services'],
  'landscaping': ['garden-design', 'garden-maintenance', 'garden-renovation', 'turf-laying', 'mulching-services', 'yard-makeover'],
  'lawn-mowing': ['grass-cutting', 'lawn-care', 'ride-on-mowing', 'acreage-mowing', 'lawn-maintenance', 'commercial-mowing'],
  'vegetation-management': ['vegetation-clearing', 'weed-control', 'scrub-clearing', 'block-clearing', 'overgrown-clearing'],
  'land-clearing': ['acreage-clearing', 'property-clearing', 'site-preparation', 'bush-clearing', 'development-clearing'],
  'chipping-mulching': ['wood-chipping', 'on-site-chipping', 'green-waste-removal', 'tree-chipping'],
}

const VARIATION_NAMES = {
  'tree-lopping': 'Tree Lopping', 'tree-cutting': 'Tree Cutting', 'tree-felling': 'Tree Felling',
  'dead-tree-removal': 'Dead Tree Removal', 'palm-tree-removal': 'Palm Tree Removal',
  'emergency-tree-removal': 'Emergency Tree Removal', 'hazardous-tree-removal': 'Hazardous Tree Removal',
  'tree-trimming': 'Tree Trimming', 'crown-reduction': 'Crown Reduction', 'branch-removal': 'Branch Removal',
  'hedge-trimming': 'Hedge Trimming', 'arborist-services': 'Arborist Services',
  'garden-design': 'Garden Design', 'garden-maintenance': 'Garden Maintenance',
  'garden-renovation': 'Garden Renovation', 'turf-laying': 'Turf Laying',
  'mulching-services': 'Mulching Services', 'yard-makeover': 'Yard Makeover',
  'grass-cutting': 'Grass Cutting', 'lawn-care': 'Lawn Care', 'ride-on-mowing': 'Ride-On Mowing',
  'acreage-mowing': 'Acreage Mowing', 'lawn-maintenance': 'Lawn Maintenance',
  'commercial-mowing': 'Commercial Mowing',
  'vegetation-clearing': 'Vegetation Clearing', 'weed-control': 'Weed Control',
  'scrub-clearing': 'Scrub Clearing', 'block-clearing': 'Block Clearing',
  'overgrown-clearing': 'Overgrown Block Clearing',
  'acreage-clearing': 'Acreage Clearing', 'property-clearing': 'Property Clearing',
  'site-preparation': 'Site Preparation', 'bush-clearing': 'Bush Clearing',
  'development-clearing': 'Development Clearing',
  'wood-chipping': 'Wood Chipping', 'on-site-chipping': 'On-Site Chipping',
  'green-waste-removal': 'Green Waste Removal', 'tree-chipping': 'Tree Chipping',
}

const beforeVariations = built
const tier12 = LOCATIONS.filter(l => l.tier <= 2)
Object.entries(VARIATIONS).forEach(([serviceSlug, variations]) => {
  const service = SERVICES.find(s => s.slug === serviceSlug)
  variations.forEach(varSlug => {
    const varName = VARIATION_NAMES[varSlug] || varSlug
    tier12.forEach(location => {
      const url = `/services/${varSlug}/${location.slug}`
      buildPage(url, {
        type: 'service-location',
        url: url + '/',
        metaTitle: `${varName} ${location.name} | Steady Eco FNQ`,
        metaDescription: `${varName} in ${location.name}, FNQ. 7 years experience. Free quotes — call ${PHONE}.`.substring(0, 155),
        h1: `${varName} in ${location.name}`,
        heroParagraph: `Professional ${varName.toLowerCase()} in ${location.name} and surrounding areas. Steady Eco brings 7 years of hands-on experience and full equipment to every job across ${location.region}.`,
        service: varName, serviceSlug: serviceSlug, location: location.name,
        quoteHeadline: `Get a Free ${varName} Quote in ${location.name}`,
        breadcrumbs: [{ label: 'Home', url: '/' }, { label: service.name, url: `/services/${serviceSlug}/` }, { label: `${varName} ${location.name}` }],
        sections: [
          { type: 'text', h2: `${varName} in ${location.name}`, body: generateLocalContext({ name: varName, slug: serviceSlug }, location) },
          { type: 'process', h2: 'How It Works', steps: generateProcessSteps(service) },
          { type: 'why', h2: `Why Choose Steady Eco for ${varName}`, bullets: generateWhyChoose(service, location), surface: true },
          { type: 'faq', h2: `${varName} FAQ — ${location.name}`, items: generateFAQs({ name: varName, slug: serviceSlug }, location) },
        ],
        relatedPages: [
          { url: `/services/${serviceSlug}/${location.slug}/`, label: `${service.name} ${location.name}` },
          ...tier12.filter(l => l.slug !== location.slug).slice(0, 3).map(l => ({ url: `/services/${varSlug}/${l.slug}/`, label: `${varName} ${l.name}` })),
        ]
      })
    })
  })
})
console.log(`  ✓ Keyword Variation pages: ${built - beforeVariations}`)

// ── BUILD GUIDE PAGES (80) ──
const GUIDES = [
  { slug: 'how-much-does-tree-removal-cost-cairns', title: 'How Much Does Tree Removal Cost in Cairns?', service: 'tree-removal' },
  { slug: 'tree-removal-permit-cairns-regional-council', title: 'Tree Removal Permits — Cairns Regional Council Guide', service: 'tree-removal' },
  { slug: 'tree-lopping-vs-tree-removal-difference', title: 'Tree Lopping vs Tree Removal — What\'s the Difference?', service: 'tree-removal' },
  { slug: 'stump-grinding-vs-stump-removal', title: 'Stump Grinding vs Stump Removal — Which Is Better?', service: 'tree-removal' },
  { slug: 'when-to-call-arborist-cairns', title: 'When to Call for Tree Work in Cairns', service: 'tree-pruning' },
  { slug: 'best-time-to-mow-lawn-in-fnq', title: 'Best Time to Mow Your Lawn in Far North Queensland', service: 'lawn-mowing' },
  { slug: 'best-grass-types-cairns-tropical-climate', title: 'Best Grass Types for Cairns Tropical Climate', service: 'lawn-mowing' },
  { slug: 'acreage-mowing-cairns-complete-guide', title: 'Acreage Mowing in Cairns — Complete Guide', service: 'lawn-mowing' },
  { slug: 'what-is-vegetation-management', title: 'What Is Vegetation Management? A Complete Guide', service: 'vegetation-management' },
  { slug: 'vegetation-management-cairns-council-requirements', title: 'Vegetation Management — Cairns Council Requirements', service: 'vegetation-management' },
  { slug: 'land-clearing-cairns-regulations', title: 'Land Clearing Regulations in Cairns', service: 'land-clearing' },
  { slug: 'chipper-blade-sharpening-vs-replacement', title: 'Chipper Blade Sharpening vs Replacement', service: 'blade-sharpening' },
  { slug: 'how-often-sharpen-mulcher-blades', title: 'How Often Should You Sharpen Mulcher Blades?', service: 'blade-sharpening' },
  { slug: 'signs-your-chipper-blades-need-sharpening', title: 'Signs Your Chipper Blades Need Sharpening', service: 'blade-sharpening' },
  { slug: 'wood-chipping-on-site-benefits', title: 'Benefits of On-Site Wood Chipping', service: 'chipping-mulching' },
  { slug: 'green-waste-removal-cairns-options', title: 'Green Waste Removal in Cairns — Your Options', service: 'chipping-mulching' },
  { slug: 'how-to-maintain-lawn-tropical-climate', title: 'How to Maintain a Lawn in Tropical Climate', service: 'lawn-mowing' },
  { slug: 'fnq-weed-management-complete-guide', title: 'FNQ Weed Management — Complete Guide', service: 'vegetation-management' },
  { slug: 'tree-pruning-timing-guide-fnq', title: 'Tree Pruning Timing Guide for FNQ', service: 'tree-pruning' },
  { slug: 'palm-tree-removal-cairns-guide', title: 'Palm Tree Removal in Cairns — Complete Guide', service: 'tree-removal' },
  { slug: 'emergency-tree-removal-cairns', title: 'Emergency Tree Removal in Cairns — What to Know', service: 'tree-removal' },
  { slug: 'how-to-choose-arborist-cairns', title: 'How to Choose a Tree Service in Cairns', service: 'tree-removal' },
  { slug: 'commercial-landscaping-cairns-guide', title: 'Commercial Landscaping in Cairns — Complete Guide', service: 'landscaping' },
  { slug: 'government-vegetation-contracts-fnq', title: 'Government Vegetation Contracts in FNQ', service: 'vegetation-management' },
  { slug: 'how-to-prepare-for-landscaping-project', title: 'How to Prepare for a Landscaping Project', service: 'landscaping' },
  { slug: 'block-clearing-cairns-what-to-expect', title: 'Block Clearing in Cairns — What to Expect', service: 'land-clearing' },
  { slug: 'seasonal-lawn-care-cairns-calendar', title: 'Seasonal Lawn Care Calendar for Cairns', service: 'lawn-mowing' },
  { slug: 'tropical-garden-design-cairns', title: 'Tropical Garden Design in Cairns', service: 'landscaping' },
  { slug: 'best-mulch-types-fnq', title: 'Best Mulch Types for FNQ Gardens', service: 'chipping-mulching' },
  { slug: 'stump-grinding-cost-guide-cairns', title: 'Stump Grinding Cost Guide — Cairns', service: 'tree-removal' },
  { slug: 'vegetation-management-after-cyclone', title: 'Vegetation Management After a Cyclone', service: 'vegetation-management' },
  { slug: 'land-clearing-acreage-properties-cairns', title: 'Land Clearing for Acreage Properties in Cairns', service: 'land-clearing' },
  { slug: 'lawn-renovation-cairns-complete-guide', title: 'Lawn Renovation in Cairns — Complete Guide', service: 'lawn-mowing' },
  { slug: 'mowing-frequency-guide-tropical-fnq', title: 'Mowing Frequency Guide for Tropical FNQ', service: 'lawn-mowing' },
  { slug: 'tree-lopping-rules-cairns', title: 'Tree Lopping Rules in Cairns', service: 'tree-removal' },
  { slug: 'after-storm-tree-cleanup-cairns', title: 'After-Storm Tree Cleanup in Cairns', service: 'tree-removal' },
  { slug: 'garden-waste-disposal-cairns', title: 'Garden Waste Disposal Options in Cairns', service: 'chipping-mulching' },
  { slug: 'commercial-mowing-contracts-cairns', title: 'Commercial Mowing Contracts in Cairns', service: 'lawn-mowing' },
  { slug: 'how-long-does-tree-removal-take', title: 'How Long Does Tree Removal Take?', service: 'tree-removal' },
  { slug: 'land-clearing-cost-guide-cairns', title: 'Land Clearing Cost Guide — Cairns', service: 'land-clearing' },
]

function generateGuideContent(guide) {
  const svc = SERVICES.find(s => s.slug === guide.service) || SERVICES[0]
  return `<p>${guide.title.replace(/[—–]/g, '-')} is one of the most common questions we hear from customers across Far North Queensland. Whether you're in Cairns, the Northern Beaches, or out on the Atherton Tablelands, understanding what's involved helps you make informed decisions about your property.</p>
<h2>What You Need to Know</h2>
<p>In Far North Queensland's tropical climate, vegetation grows faster than almost anywhere else in Australia. The wet season from November to April brings explosive growth, while the dry season is the ideal time for major work. Steady Eco services the full Cairns region with 7 years of hands-on experience, a tipper truck, wood chipper, ride-on mower, and chainsaws.</p>
<h2>How Steady Eco Can Help</h2>
<p>We provide professional ${svc.name.toLowerCase()} services across all of FNQ. Every job includes complete clean-up — all green waste is either chipped into mulch for your garden or removed with our tipper truck. We respond to all enquiries within one business day and provide free, no-obligation quotes.</p>
<h3>Our Equipment</h3>
<p>We arrive fully equipped to every job: tipper truck for waste removal, commercial wood chipper for on-site processing, ride-on mower for large properties, chainsaws for tree work, and whipper snippers for detail finishing. No delays, no return trips.</p>
<h3>Our Experience</h3>
<p>Steady Eco was built on 7 years of hands-on experience in tree work and landscaping, trained under TRIMSNQ — an established Far North Queensland business. That trade knowledge means we know FNQ conditions, vegetation types, and the right approach for every job.</p>
<h2>Getting a Quote</h2>
<p>Contact Steady Eco for a free, no-obligation quote. Call ${PHONE} or use our online quote tool. We respond within one business day and can typically schedule work within the same week.</p>`
}

const beforeGuides = built
GUIDES.forEach(guide => {
  const svc = SERVICES.find(s => s.slug === guide.service) || SERVICES[0]
  const url = `/guides/${guide.slug}`
  buildPage(url, {
    type: 'guide',
    url: url + '/',
    metaTitle: `${guide.title} | Steady Eco`,
    metaDescription: `${guide.title}. Expert advice from Steady Eco, Cairns FNQ. 7 years experience. Free quotes — call ${PHONE}.`.substring(0, 155),
    h1: guide.title,
    heroParagraph: `Expert guide from Steady Eco — 7 years of hands-on experience in ${svc.name.toLowerCase()} across Far North Queensland.`,
    service: svc.name, serviceSlug: svc.slug, location: 'Cairns',
    quoteHeadline: `Need ${svc.name}? Get a Free Quote`,
    breadcrumbs: [{ label: 'Home', url: '/' }, { label: 'Guides', url: '/guides/' }, { label: guide.title }],
    sections: [
      { type: 'text', h2: guide.title, body: generateGuideContent(guide) },
      { type: 'faq', h2: 'Related Questions', items: [
        { q: `How much does ${svc.name.toLowerCase()} cost in Cairns?`, a: `${svc.name} pricing depends on the scope of work. We provide free, no-obligation quotes within one business day. Call ${PHONE} or use our online quote tool.` },
        { q: 'What areas do you service?', a: 'We service all of Far North Queensland within a 100km radius of Cairns — including the Northern Beaches, Atherton Tablelands, Port Douglas, and Cassowary Coast.' },
        { q: 'How quickly can you start?', a: 'We respond to all enquiries within one business day and can typically schedule work within the same week. Emergency tree work is prioritised for same-day response.' },
      ]},
    ],
    relatedPages: GUIDES.filter(g => g.slug !== guide.slug && g.service === guide.service).slice(0, 3).map(g => ({ url: `/guides/${g.slug}/`, label: g.title }))
  })
})
console.log(`  ✓ Guide pages: ${built - beforeGuides}`)

// ── BUILD FAQ PAGES (30) ──
const FAQS = [
  { slug: 'how-much-does-tree-removal-cost-cairns', q: 'How much does tree removal cost in Cairns?', service: 'tree-removal' },
  { slug: 'is-steady-eco-insured', q: 'Is Steady Eco insured?', service: 'tree-removal' },
  { slug: 'do-you-service-my-suburb', q: 'Do you service my suburb?', service: 'landscaping' },
  { slug: 'how-to-get-a-quote-steady-eco', q: 'How do I get a quote from Steady Eco?', service: 'landscaping' },
  { slug: 'what-happens-to-green-waste-after-job', q: 'What happens to green waste after the job?', service: 'chipping-mulching' },
  { slug: 'do-you-offer-emergency-tree-services', q: 'Do you offer emergency tree services?', service: 'tree-removal' },
  { slug: 'how-far-do-you-travel-from-cairns', q: 'How far do you travel from Cairns?', service: 'landscaping' },
  { slug: 'what-is-vegetation-management', q: 'What is vegetation management?', service: 'vegetation-management' },
  { slug: 'how-much-does-lawn-mowing-cost-cairns', q: 'How much does lawn mowing cost in Cairns?', service: 'lawn-mowing' },
  { slug: 'what-services-does-steady-eco-offer', q: 'What services does Steady Eco offer?', service: 'landscaping' },
  { slug: 'how-quickly-can-you-start-a-job', q: 'How quickly can you start a job?', service: 'landscaping' },
  { slug: 'is-blade-sharpening-worth-it', q: 'Is blade sharpening worth it vs buying new?', service: 'blade-sharpening' },
  { slug: 'what-makes-steady-eco-different', q: 'What makes Steady Eco different?', service: 'landscaping' },
  { slug: 'do-you-chip-on-site', q: 'Do you chip on-site?', service: 'chipping-mulching' },
  { slug: 'do-you-work-on-weekends', q: 'Do you work on weekends?', service: 'landscaping' },
  { slug: 'how-much-does-land-clearing-cost', q: 'How much does land clearing cost?', service: 'land-clearing' },
  { slug: 'do-you-service-large-rural-properties', q: 'Do you service large rural properties?', service: 'lawn-mowing' },
  { slug: 'how-often-should-i-mow-my-lawn-cairns', q: 'How often should I mow my lawn in Cairns?', service: 'lawn-mowing' },
  { slug: 'do-you-offer-regular-maintenance-contracts', q: 'Do you offer regular maintenance contracts?', service: 'lawn-mowing' },
]

const faqAnswers = {
  'how-much-does-tree-removal-cost-cairns': 'Tree removal costs in Cairns vary based on tree size, species, location, and access. A small tree under 5m might start from $300, while large trees near structures can cost $3,000-$8,000+. We provide free, no-obligation quotes — call 0456 190 202 or use our online quote tool.',
  'is-steady-eco-insured': 'Yes. Steady Eco carries appropriate insurance for all work we undertake. We are a registered business (ABN 49 553 784 085) with 7 years of hands-on experience in tree work and landscaping.',
  'do-you-service-my-suburb': 'We service all suburbs within a 100km radius of Cairns — from Port Douglas in the north to Babinda in the south, and the Atherton Tablelands to the west. Contact us to confirm your area.',
  'how-to-get-a-quote-steady-eco': 'Three ways: use our online quote tool at steadyeco.com/quote, call 0456 190 202, or email. We respond to all enquiries within one business day.',
  'what-happens-to-green-waste-after-job': 'All green waste is either chipped into mulch on-site (free for your garden beds) or loaded onto our tipper truck and removed. Your property is left clean after every job.',
  'do-you-offer-emergency-tree-services': 'Yes. After storms and cyclones, we prioritise emergency tree removal and debris clearing. Call 0456 190 202 for urgent response.',
  'how-far-do-you-travel-from-cairns': 'We service a 100km radius from our Cairns base — including Northern Beaches, Atherton Tablelands, Port Douglas, and south to Babinda/Gordonvale. For larger projects, we can travel further.',
  'what-is-vegetation-management': 'Vegetation management covers land clearing, weed control, scrub clearing, roadside vegetation maintenance, and site preparation. We service residential, commercial, and government clients.',
  'how-much-does-lawn-mowing-cost-cairns': 'Lawn mowing in Cairns starts from around $60-80 for a standard residential block. Larger properties, acreage, and ride-on mowing are quoted per job. Contact us for a free quote.',
  'what-services-does-steady-eco-offer': 'We offer tree removal, tree pruning, landscaping, lawn mowing, vegetation management, blade sharpening ($120/set), land clearing, and chipping/mulching services across FNQ.',
  'how-quickly-can-you-start-a-job': 'We respond within one business day and can typically schedule work within the same week. Emergency tree work after storms is prioritised for same-day response.',
  'is-blade-sharpening-worth-it': 'Absolutely. A sharpened blade at $120 per set lasts hundreds of hours and performs like new. A replacement set costs $400-$800+. Sharpening saves 70-85% compared to replacement.',
  'what-makes-steady-eco-different': '7 years hands-on experience trained under TRIMSNQ, a fully equipped operation (tipper, chipper, ride-on, chainsaws), local Cairns operator, same-week response, and complete clean-up on every job.',
  'do-you-chip-on-site': 'Yes. We bring our commercial wood chipper to every tree and clearing job. Branches are chipped into mulch on-site — you can keep it for garden beds or we remove it with the tipper.',
  'do-you-work-on-weekends': 'Our standard hours are Monday to Saturday, 5am to 6:30pm. We can arrange Saturday work and emergency callouts as needed.',
  'how-much-does-land-clearing-cost': 'Land clearing costs depend on block size, vegetation density, and access. Small residential blocks from $1,000, larger acreage from $3,000+. We provide free on-site assessments.',
  'do-you-service-large-rural-properties': 'Yes. We have a ride-on mower, tipper truck, and wood chipper — ideal for large rural properties, acreage, and Tablelands blocks. Regular maintenance schedules available.',
  'how-often-should-i-mow-my-lawn-cairns': 'In Cairns tropical climate, most lawns need mowing every 1-2 weeks in the wet season (Nov-Apr) and every 2-3 weeks in the dry season (May-Oct). Regular mowing promotes a healthier lawn.',
  'do-you-offer-regular-maintenance-contracts': 'Yes. We offer fortnightly and weekly maintenance for residential and commercial properties. Regular clients get priority scheduling and consistent service.',
}

const beforeFaqs = built
FAQS.forEach(faq => {
  const svc = SERVICES.find(s => s.slug === faq.service) || SERVICES[0]
  const url = `/faq/${faq.slug}`
  const answer = faqAnswers[faq.slug] || `Contact Steady Eco for more information. Call ${PHONE} or use our online quote tool.`
  buildPage(url, {
    type: 'faq',
    url: url + '/',
    metaTitle: `${faq.q} | Steady Eco FAQ`,
    metaDescription: `${answer}`.substring(0, 155),
    h1: faq.q,
    heroParagraph: answer,
    service: svc.name, serviceSlug: svc.slug, location: 'Cairns',
    quoteHeadline: `Got More Questions? Get a Free Quote`,
    breadcrumbs: [{ label: 'Home', url: '/' }, { label: 'FAQ', url: '/faq/' }, { label: faq.q }],
    sections: [
      { type: 'text', h2: faq.q, body: `<p>${answer}</p><p>For a personalised answer specific to your property, contact Steady Eco. We respond to all enquiries within one business day and provide free, no-obligation quotes across Far North Queensland.</p>` },
      { type: 'why', h2: 'Why Choose Steady Eco', bullets: generateWhyChoose(svc, LOCATIONS[0]), surface: true },
    ],
    relatedPages: FAQS.filter(f => f.slug !== faq.slug).slice(0, 6).map(f => ({ url: `/faq/${f.slug}/`, label: f.q }))
  })
})
console.log(`  ✓ FAQ pages: ${built - beforeFaqs}`)

// ── BUILD AREA CLUSTER PAGES (20) ──
const AREAS = [
  { slug: 'northern-beaches-cairns', name: 'Northern Beaches Cairns', locations: ['Holloways Beach', 'Machans Beach', 'Yorkeys Knob', 'Trinity Park', 'Trinity Beach', 'Kewarra Beach', 'Clifton Beach', 'Palm Cove', 'Ellis Beach'] },
  { slug: 'cairns-inner-suburbs', name: 'Cairns Inner Suburbs', locations: ['Cairns City', 'Cairns North', 'Bungalow', 'Manunda', 'Manoora', 'Mooroobool', 'Westcourt', 'Parramatta Park', 'Edge Hill'] },
  { slug: 'cairns-southern-suburbs', name: 'Cairns Southern Suburbs', locations: ['Edmonton', 'Bentley Park', 'Mount Sheridan', 'Woree', 'White Rock', 'Gordonvale', 'Earlville', 'Bayview Heights'] },
  { slug: 'cairns-western-suburbs', name: 'Cairns Western Suburbs', locations: ['Freshwater', 'Redlynch', 'Kamerunga', 'Brinsmead', 'Lake Placid', 'Caravonica', 'Barron Gorge'] },
  { slug: 'atherton-tablelands', name: 'Atherton Tablelands', locations: ['Atherton', 'Mareeba', 'Yungaburra', 'Malanda', 'Ravenshoe', 'Tolga', 'Herberton', 'Kairi'] },
  { slug: 'douglas-shire', name: 'Douglas Shire', locations: ['Port Douglas', 'Mossman', 'Daintree', 'Cape Tribulation', 'Wonga Beach', 'Julatten', 'Mount Molloy'] },
  { slug: 'cassowary-coast', name: 'Cassowary Coast', locations: ['Innisfail', 'Mission Beach', 'Tully', 'Babinda', 'Cardwell', 'Silkwood'] },
  { slug: 'redlynch-valley', name: 'Redlynch Valley', locations: ['Redlynch', 'Kamerunga', 'Lake Placid', 'Freshwater', 'Brinsmead'] },
  { slug: 'smithfield-region', name: 'Smithfield Region', locations: ['Smithfield', 'Caravonica', 'Yorkeys Knob', 'Trinity Park', 'Trinity Beach'] },
  { slug: 'far-north-queensland', name: 'Far North Queensland', locations: ['Cairns City', 'Port Douglas', 'Atherton', 'Innisfail', 'Mareeba', 'Mission Beach', 'Tully'] },
  { slug: 'port-douglas-region', name: 'Port Douglas Region', locations: ['Port Douglas', 'Mossman', 'Daintree', 'Wonga Beach', 'Cooya Beach'] },
  { slug: 'gordonvale-region', name: 'Gordonvale Region', locations: ['Gordonvale', 'Edmonton', 'Mount Peter', 'Babinda'] },
  { slug: 'edmonton-bentley-park', name: 'Edmonton & Bentley Park', locations: ['Edmonton', 'Bentley Park', 'Mount Sheridan', 'White Rock', 'Mount Peter'] },
  { slug: 'palm-cove-northern-beaches', name: 'Palm Cove & Northern Beaches', locations: ['Palm Cove', 'Clifton Beach', 'Kewarra Beach', 'Ellis Beach', 'Trinity Beach'] },
  { slug: 'kuranda-rainforest', name: 'Kuranda & Rainforest', locations: ['Kuranda', 'Speewah', 'Koah', 'Barron Gorge', 'Caravonica'] },
  { slug: 'mareeba-region', name: 'Mareeba Region', locations: ['Mareeba', 'Dimbulah', 'Walkamin', 'Mount Molloy', 'Julatten'] },
]

const beforeAreas = built
AREAS.forEach(area => {
  const url = `/areas/${area.slug}`
  buildPage(url, {
    type: 'area-cluster',
    url: url + '/',
    metaTitle: `${area.name} Services | Steady Eco FNQ`,
    metaDescription: `Landscaping, tree work, mowing, and vegetation management across ${area.name}. Steady Eco — 7 years experience. Call ${PHONE}.`.substring(0, 155),
    h1: `Steady Eco Services — ${area.name}`,
    heroParagraph: `Professional landscaping, tree work, lawn mowing, vegetation management, and blade sharpening across ${area.name}. Steady Eco services the entire region with 7 years experience, full equipment, and same-week response.`,
    location: area.name,
    quoteHeadline: `Get a Free Quote — ${area.name}`,
    breadcrumbs: [{ label: 'Home', url: '/' }, { label: 'Areas', url: '/areas/' }, { label: area.name }],
    sections: [
      { type: 'services', h2: `Services in ${area.name}`, surface: true, items: SERVICES.map(s => ({ name: s.name, desc: s.desc, url: `/services/${s.slug}/` })) },
      { type: 'area', h2: `Suburbs & Towns We Service`, body: `Steady Eco covers all of ${area.name}. Here are the specific areas within this region:`, locations: area.locations, surface: true },
    ],
    relatedPages: AREAS.filter(a => a.slug !== area.slug).slice(0, 6).map(a => ({ url: `/areas/${a.slug}/`, label: a.name }))
  })
})
console.log(`  ✓ Area Cluster pages: ${built - beforeAreas}`)

// ── BUILD COMPARISON PAGES (15) ──
const COMPARISONS = [
  { slug: 'best-arborist-cairns', title: 'Best Tree Services in Cairns' },
  { slug: 'cheapest-lawn-mowing-cairns', title: 'Affordable Lawn Mowing in Cairns' },
  { slug: 'best-landscaper-cairns', title: 'Best Landscaper in Cairns' },
  { slug: 'top-tree-loppers-cairns', title: 'Top Tree Loppers in Cairns' },
  { slug: 'cairns-tree-removal-prices', title: 'Cairns Tree Removal Prices Guide' },
  { slug: 'cairns-mowing-services-comparison', title: 'Cairns Mowing Services — What to Look For' },
  { slug: 'local-arborist-vs-national-company', title: 'Local Tree Service vs National Company — Cairns' },
  { slug: 'tree-removal-vs-tree-lopping', title: 'Tree Removal vs Tree Lopping — Which Do You Need?' },
  { slug: 'stump-grinding-vs-chemical-removal', title: 'Stump Grinding vs Chemical Removal' },
  { slug: 'professional-mowing-vs-diy', title: 'Professional Mowing vs DIY — Is It Worth It?' },
  { slug: 'on-site-chipping-vs-skip-bin', title: 'On-Site Chipping vs Skip Bin — Cost Comparison' },
  { slug: 'regular-maintenance-vs-once-off', title: 'Regular Maintenance vs Once-Off — What Saves More?' },
]

const beforeComps = built
COMPARISONS.forEach(comp => {
  const url = `/compare/${comp.slug}`
  buildPage(url, {
    type: 'comparison',
    url: url + '/',
    metaTitle: `${comp.title} | Steady Eco`,
    metaDescription: `${comp.title}. Honest comparison from Steady Eco — 7 years experience in Cairns FNQ. Free quotes. Call ${PHONE}.`.substring(0, 155),
    h1: comp.title,
    heroParagraph: `An honest look at ${comp.title.toLowerCase()} from Steady Eco. We've been doing this for 7 years across Far North Queensland — here's what we've learned.`,
    location: 'Cairns',
    quoteHeadline: 'Ready to Get Started? Free Quote',
    breadcrumbs: [{ label: 'Home', url: '/' }, { label: 'Compare', url: '/compare/' }, { label: comp.title }],
    sections: [
      { type: 'text', h2: comp.title, body: `<p>When you're looking for ${comp.title.toLowerCase()}, it helps to understand what you're comparing and what actually matters for your property.</p><h3>What to Look For</h3><p>In Far North Queensland, the tropical climate means vegetation grows faster than almost anywhere in Australia. That means the quality of work, reliability of the operator, and their equipment all matter more than the lowest price. A cheap job done poorly will need redoing in weeks.</p><h3>Why Steady Eco</h3><p>We bring 7 years of hands-on experience, a tipper truck, wood chipper, ride-on mower, and chainsaws to every job. We were trained under TRIMSNQ — an established FNQ tree services business. We respond within one business day, provide free quotes, and leave every property clean.</p><h3>Get a Quote</h3><p>Contact Steady Eco for a free, no-obligation quote. Call ${PHONE} or use our online quote tool. We service all of FNQ within a 100km radius of Cairns.</p>` },
      { type: 'why', h2: 'Why Choose Steady Eco', bullets: generateWhyChoose(SERVICES[0], LOCATIONS[0]), surface: true },
    ],
    relatedPages: COMPARISONS.filter(c => c.slug !== comp.slug).slice(0, 6).map(c => ({ url: `/compare/${c.slug}/`, label: c.title }))
  })
})
console.log(`  ✓ Comparison pages: ${built - beforeComps}`)

// ── GENERATE SITEMAP ──
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${DOMAIN}/</loc><lastmod>${new Date().toISOString().split('T')[0]}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
${sitemapUrls.map(u => `  <url><loc>${DOMAIN}${u}/</loc><lastmod>${new Date().toISOString().split('T')[0]}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join('\n')}
</urlset>`

fs.writeFileSync(path.join(ROOT, 'sitemap-seo.xml'), sitemapXml, 'utf8')
console.log(`  ✓ Sitemap: ${sitemapUrls.length} URLs`)

// ── SUMMARY ──
console.log('━'.repeat(50))
console.log(`  🌿 TOTAL PAGES BUILT: ${built}`)
console.log(`  📍 Locations: ${LOCATIONS.length}`)
console.log(`  🔧 Services: ${SERVICES.length}`)
console.log(`  🗺️  Sitemap: sitemap-seo.xml`)
console.log('━'.repeat(50))
console.log('  Done. Run from: seo-pages/')
console.log('')
