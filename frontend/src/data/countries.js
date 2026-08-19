/**
 * Complete Worldwide Countries Database (English)
 * ISO 3166-1 alpha-2, alpha-3, numeric ISO & ITU-T dial codes.
 *
 * Automatically sorted alphabetically by English country name.
 */

const RAW_COUNTRIES = [
  { name: 'Afghanistan', code: 'AF', iso3: 'AFG', dialCode: '+93', flag: '🇦🇫', localName: 'Afghānestān', numericCode: '004' },
  { name: 'Albania', code: 'AL', iso3: 'ALB', dialCode: '+355', flag: '🇦🇱', localName: 'Shqipëria', numericCode: '008' },
  { name: 'Algeria', code: 'DZ', iso3: 'DZA', dialCode: '+213', flag: '🇩🇿', localName: 'Al-Jazā\'ir', numericCode: '012' },
  { name: 'Andorra', code: 'AD', iso3: 'AND', dialCode: '+376', flag: '🇦🇩', localName: 'Andorra', numericCode: '020' },
  { name: 'Angola', code: 'AO', iso3: 'AGO', dialCode: '+244', flag: '🇦🇴', localName: 'Angola', numericCode: '024' },
  { name: 'Anguilla', code: 'AI', iso3: 'AIA', dialCode: '+1', flag: '🇦🇮', localName: 'Anguilla', numericCode: '660' },
  { name: 'Antigua and Barbuda', code: 'AG', iso3: 'ATG', dialCode: '+1', flag: '🇦🇬', localName: 'Antigua and Barbuda', numericCode: '028' },
  { name: 'Argentina', code: 'AR', iso3: 'ARG', dialCode: '+54', flag: '🇦🇷', localName: 'Argentina', numericCode: '032' },
  { name: 'Armenia', code: 'AM', iso3: 'ARM', dialCode: '+374', flag: '🇦🇲', localName: 'Hayastan', numericCode: '051' },
  { name: 'Aruba', code: 'AW', iso3: 'ABW', dialCode: '+297', flag: '🇦🇼', localName: 'Aruba', numericCode: '533' },
  { name: 'Australia', code: 'AU', iso3: 'AUS', dialCode: '+61', flag: '🇦🇺', localName: 'Australia', numericCode: '036' },
  { name: 'Austria', code: 'AT', iso3: 'AUT', dialCode: '+43', flag: '🇦🇹', localName: 'Österreich', numericCode: '040' },
  { name: 'Azerbaijan', code: 'AZ', iso3: 'AZE', dialCode: '+994', flag: '🇦🇿', localName: 'Azərbaycan', numericCode: '031' },

  { name: 'Bahamas', code: 'BS', iso3: 'BHS', dialCode: '+1', flag: '🇧🇸', localName: 'Bahamas', numericCode: '044' },
  { name: 'Bahrain', code: 'BH', iso3: 'BHR', dialCode: '+973', flag: '🇧🇭', localName: 'Al-Bahrayn', numericCode: '048' },
  { name: 'Bangladesh', code: 'BD', iso3: 'BGD', dialCode: '+880', flag: '🇧🇩', localName: 'Bangladesh', numericCode: '050' },
  { name: 'Barbados', code: 'BB', iso3: 'BRB', dialCode: '+1', flag: '🇧🇧', localName: 'Barbados', numericCode: '052' },
  { name: 'Belarus', code: 'BY', iso3: 'BLR', dialCode: '+375', flag: '🇧🇾', localName: 'Bielaruś', numericCode: '112' },
  { name: 'Belgium', code: 'BE', iso3: 'BEL', dialCode: '+32', flag: '🇧🇪', localName: 'België / Belgique', numericCode: '056' },
  { name: 'Belize', code: 'BZ', iso3: 'BLZ', dialCode: '+501', flag: '🇧🇿', localName: 'Belize', numericCode: '084' },
  { name: 'Benin', code: 'BJ', iso3: 'BEN', dialCode: '+229', flag: '🇧🇯', localName: 'Bénin', numericCode: '204' },
  { name: 'Bermuda', code: 'BM', iso3: 'BMU', dialCode: '+1', flag: '🇧🇲', localName: 'Bermuda', numericCode: '060' },
  { name: 'Bhutan', code: 'BT', iso3: 'BTN', dialCode: '+975', flag: '🇧🇹', localName: 'Druk Yul', numericCode: '064' },
  { name: 'Bolivia', code: 'BO', iso3: 'BOL', dialCode: '+591', flag: '🇧🇴', localName: 'Bolivia', numericCode: '068' },
  { name: 'Bosnia and Herzegovina', code: 'BA', iso3: 'BIH', dialCode: '+387', flag: '🇧🇦', localName: 'Bosna i Hercegovina', numericCode: '070' },
  { name: 'Botswana', code: 'BW', iso3: 'BWA', dialCode: '+267', flag: '🇧🇼', localName: 'Botswana', numericCode: '072' },
  { name: 'Brazil', code: 'BR', iso3: 'BRA', dialCode: '+55', flag: '🇧🇷', localName: 'Brasil', numericCode: '076' },
  { name: 'Brunei', code: 'BN', iso3: 'BRN', dialCode: '+673', flag: '🇧🇳', localName: 'Negara Brunei Darussalam', numericCode: '096' },
  { name: 'Bulgaria', code: 'BG', iso3: 'BGR', dialCode: '+359', flag: '🇧🇬', localName: 'Bulgariya', numericCode: '100' },
  { name: 'Burkina Faso', code: 'BF', iso3: 'BFA', dialCode: '+226', flag: '🇧🇫', localName: 'Burkina Faso', numericCode: '854' },
  { name: 'Burundi', code: 'BI', iso3: 'BDI', dialCode: '+257', flag: '🇧🇮', localName: 'Uburundi', numericCode: '108' },

  { name: 'Cambodia', code: 'KH', iso3: 'KHM', dialCode: '+855', flag: '🇰🇭', localName: 'Kâmpŭchéa', numericCode: '116' },
  { name: 'Cameroon', code: 'CM', iso3: 'CMR', dialCode: '+237', flag: '🇨🇲', localName: 'Cameroon', numericCode: '120' },
  { name: 'Canada', code: 'CA', iso3: 'CAN', dialCode: '+1', flag: '🇨🇦', localName: 'Canada', numericCode: '124' },
  { name: 'Cape Verde', code: 'CV', iso3: 'CPV', dialCode: '+238', flag: '🇨🇻', localName: 'Cabo Verde', numericCode: '132' },
  { name: 'Central African Republic', code: 'CF', iso3: 'CAF', dialCode: '+236', flag: '🇨🇫', localName: 'République centrafricaine', numericCode: '140' },
  { name: 'Chad', code: 'TD', iso3: 'TCD', dialCode: '+235', flag: '🇹🇩', localName: 'Tchad', numericCode: '148' },
  { name: 'Chile', code: 'CL', iso3: 'CHL', dialCode: '+56', flag: '🇨🇱', localName: 'Chile', numericCode: '152' },
  { name: 'China', code: 'CN', iso3: 'CHN', dialCode: '+86', flag: '🇨🇳', localName: 'Zhōngguó', numericCode: '156' },
  { name: 'Colombia', code: 'CO', iso3: 'COL', dialCode: '+57', flag: '🇨🇴', localName: 'Colombia', numericCode: '170' },
  { name: 'Comoros', code: 'KM', iso3: 'COM', dialCode: '+269', flag: '🇰🇲', localName: 'Komori', numericCode: '174' },
  { name: 'Congo (Brazzaville)', code: 'CG', iso3: 'COG', dialCode: '+242', flag: '🇨🇬', localName: 'Congo-Brazzaville', numericCode: '178' },
  { name: 'Congo (Kinshasa - DRC)', code: 'CD', iso3: 'COD', dialCode: '+243', flag: '🇨🇩', localName: 'RDC', numericCode: '180' },
  { name: 'Costa Rica', code: 'CR', iso3: 'CRI', dialCode: '+506', flag: '🇨🇷', localName: 'Costa Rica', numericCode: '188' },
  { name: 'Croatia', code: 'HR', iso3: 'HRV', dialCode: '+385', flag: '🇭🇷', localName: 'Hrvatska', numericCode: '191' },
  { name: 'Cuba', code: 'CU', iso3: 'CUB', dialCode: '+53', flag: '🇨🇺', localName: 'Cuba', numericCode: '192' },
  { name: 'Curaçao', code: 'CW', iso3: 'CUW', dialCode: '+599', flag: '🇨🇼', localName: 'Curaçao', numericCode: '531' },
  { name: 'Cyprus', code: 'CY', iso3: 'CYP', dialCode: '+357', flag: '🇨🇾', localName: 'Kýpros', numericCode: '196' },
  { name: 'Czech Republic', code: 'CZ', iso3: 'CZE', dialCode: '+420', flag: '🇨🇿', localName: 'Česká republika', numericCode: '203' },
  { name: 'Côte d\'Ivoire', code: 'CI', iso3: 'CIV', dialCode: '+225', flag: '🇨🇮', localName: 'Côte d\'Ivoire', numericCode: '384' },

  { name: 'Denmark', code: 'DK', iso3: 'DNK', dialCode: '+45', flag: '🇩🇰', localName: 'Danmark', numericCode: '208' },
  { name: 'Djibouti', code: 'DJ', iso3: 'DJI', dialCode: '+253', flag: '🇩🇯', localName: 'Djibouti', numericCode: '262' },
  { name: 'Dominica', code: 'DM', iso3: 'DMA', dialCode: '+1', flag: '🇩🇲', localName: 'Dominica', numericCode: '212' },
  { name: 'Dominican Republic', code: 'DO', iso3: 'DOM', dialCode: '+1', flag: '🇩🇴', localName: 'República Dominicana', numericCode: '214' },

  { name: 'Ecuador', code: 'EC', iso3: 'ECU', dialCode: '+593', flag: '🇪🇨', localName: 'Ecuador', numericCode: '218' },
  { name: 'Egypt', code: 'EG', iso3: 'EGY', dialCode: '+20', flag: '🇪🇬', localName: 'Miṣr', numericCode: '818' },
  { name: 'El Salvador', code: 'SV', iso3: 'SLV', dialCode: '+503', flag: '🇸🇻', localName: 'El Salvador', numericCode: '222' },
  { name: 'Equatorial Guinea', code: 'GQ', iso3: 'GNQ', dialCode: '+240', flag: '🇬🇶', localName: 'Guinea Ecuatorial', numericCode: '226' },
  { name: 'Eritrea', code: 'ER', iso3: 'ERI', dialCode: '+291', flag: '🇪🇷', localName: 'Iritriya', numericCode: '232' },
  { name: 'Estonia', code: 'EE', iso3: 'EST', dialCode: '+372', flag: '🇪🇪', localName: 'Eesti', numericCode: '233' },
  { name: 'Eswatini', code: 'SZ', iso3: 'SWZ', dialCode: '+268', flag: '🇸🇿', localName: 'eSwatini', numericCode: '748' },
  { name: 'Ethiopia', code: 'ET', iso3: 'ETH', dialCode: '+251', flag: '🇪🇹', localName: 'Ityop\'iya', numericCode: '231' },

  { name: 'Fiji', code: 'FJ', iso3: 'FJI', dialCode: '+679', flag: '🇫🇯', localName: 'Fiji', numericCode: '242' },
  { name: 'Finland', code: 'FI', iso3: 'FIN', dialCode: '+358', flag: '🇫🇮', localName: 'Suomi', numericCode: '246' },
  { name: 'France', code: 'FR', iso3: 'FRA', dialCode: '+33', flag: '🇫🇷', localName: 'France', numericCode: '250' },
  { name: 'French Guiana', code: 'GF', iso3: 'GUF', dialCode: '+594', flag: '🇬🇫', localName: 'Guyane', numericCode: '254' },
  { name: 'French Polynesia', code: 'PF', iso3: 'PYF', dialCode: '+689', flag: '🇵🇫', localName: 'Polynésie française', numericCode: '258' },

  { name: 'Gabon', code: 'GA', iso3: 'GAB', dialCode: '+241', flag: '🇬🇦', localName: 'Gabon', numericCode: '266' },
  { name: 'Gambia', code: 'GM', iso3: 'GMB', dialCode: '+220', flag: '🇬🇲', localName: 'Gambia', numericCode: '270' },
  { name: 'Georgia', code: 'GE', iso3: 'GEO', dialCode: '+995', flag: '🇬🇪', localName: 'Sakartvelo', numericCode: '268' },
  { name: 'Germany', code: 'DE', iso3: 'DEU', dialCode: '+49', flag: '🇩🇪', localName: 'Deutschland', numericCode: '276' },
  { name: 'Ghana', code: 'GH', iso3: 'GHA', dialCode: '+233', flag: '🇬🇭', localName: 'Ghana', numericCode: '288' },
  { name: 'Gibraltar', code: 'GI', iso3: 'GIB', dialCode: '+350', flag: '🇬🇮', localName: 'Gibraltar', numericCode: '292' },
  { name: 'Greece', code: 'GR', iso3: 'GRC', dialCode: '+30', flag: '🇬🇷', localName: 'Elláda', numericCode: '300' },
  { name: 'Greenland', code: 'GL', iso3: 'GRL', dialCode: '+299', flag: '🇬🇱', localName: 'Kalaallit Nunaat', numericCode: '304' },
  { name: 'Grenada', code: 'GD', iso3: 'GRD', dialCode: '+1', flag: '🇬🇩', localName: 'Grenada', numericCode: '308' },
  { name: 'Guadeloupe', code: 'GP', iso3: 'GLP', dialCode: '+590', flag: '🇬🇵', localName: 'Guadeloupe', numericCode: '312' },
  { name: 'Guam', code: 'GU', iso3: 'GUM', dialCode: '+1', flag: '🇬🇺', localName: 'Guam', numericCode: '316' },
  { name: 'Guatemala', code: 'GT', iso3: 'GTM', dialCode: '+502', flag: '🇬🇹', localName: 'Guatemala', numericCode: '320' },
  { name: 'Guernsey', code: 'GG', iso3: 'GGY', dialCode: '+44', flag: '🇬🇬', localName: 'Guernsey', numericCode: '831' },
  { name: 'Guinea', code: 'GN', iso3: 'GIN', dialCode: '+224', flag: '🇬🇳', localName: 'Guinée', numericCode: '324' },
  { name: 'Guinea-Bissau', code: 'GW', iso3: 'GNB', dialCode: '+245', flag: '🇬🇼', localName: 'Guiné-Bissau', numericCode: '624' },
  { name: 'Guyana', code: 'GY', iso3: 'GUY', dialCode: '+592', flag: '🇬🇾', localName: 'Guyana', numericCode: '328' },

  { name: 'Haiti', code: 'HT', iso3: 'HTI', dialCode: '+509', flag: '🇭🇹', localName: 'Haïti', numericCode: '332' },
  { name: 'Honduras', code: 'HN', iso3: 'HND', dialCode: '+504', flag: '🇭🇳', localName: 'Honduras', numericCode: '340' },
  { name: 'Hong Kong', code: 'HK', iso3: 'HKG', dialCode: '+852', flag: '🇭🇰', localName: 'Hong Kong', numericCode: '344' },
  { name: 'Hungary', code: 'HU', iso3: 'HUN', dialCode: '+36', flag: '🇭🇺', localName: 'Magyarország', numericCode: '348' },

  { name: 'Iceland', code: 'IS', iso3: 'ISL', dialCode: '+354', flag: '🇮🇸', localName: 'Ísland', numericCode: '352' },
  { name: 'India', code: 'IN', iso3: 'IND', dialCode: '+91', flag: '🇮🇳', localName: 'Bhārat', numericCode: '356' },
  { name: 'Indonesia', code: 'ID', iso3: 'IDN', dialCode: '+62', flag: '🇮🇩', localName: 'Indonesia', numericCode: '360' },
  { name: 'Iran', code: 'IR', iso3: 'IRN', dialCode: '+98', flag: '🇮🇷', localName: 'Īrān', numericCode: '364' },
  { name: 'Iraq', code: 'IQ', iso3: 'IRQ', dialCode: '+964', flag: '🇮🇶', localName: 'Al-ʻIrāq', numericCode: '368' },
  { name: 'Ireland', code: 'IE', iso3: 'IRL', dialCode: '+353', flag: '🇮🇪', localName: 'Ireland', numericCode: '372' },
  { name: 'Isle of Man', code: 'IM', iso3: 'IMN', dialCode: '+44', flag: '🇮🇲', localName: 'Isle of Man', numericCode: '833' },
  { name: 'Israel', code: 'IL', iso3: 'ISR', dialCode: '+972', flag: '🇮🇱', localName: 'Yisra\'el', numericCode: '376' },
  { name: 'Italy', code: 'IT', iso3: 'ITA', dialCode: '+39', flag: '🇮🇹', localName: 'Italia', numericCode: '380' },

  { name: 'Jamaica', code: 'JM', iso3: 'JAM', dialCode: '+1', flag: '🇯🇲', localName: 'Jamaica', numericCode: '388' },
  { name: 'Japan', code: 'JP', iso3: 'JPN', dialCode: '+81', flag: '🇯🇵', localName: 'Nihon / Nippon', numericCode: '392' },
  { name: 'Jersey', code: 'JE', iso3: 'JEY', dialCode: '+44', flag: '🇯🇪', localName: 'Jersey', numericCode: '832' },
  { name: 'Jordan', code: 'JO', iso3: 'JOR', dialCode: '+962', flag: '🇯🇴', localName: 'Al-Urdunn', numericCode: '400' },

  { name: 'Kazakhstan', code: 'KZ', iso3: 'KAZ', dialCode: '+7', flag: '🇰🇿', localName: 'Qazaqstan', numericCode: '398' },
  { name: 'Kenya', code: 'KE', iso3: 'KEN', dialCode: '+254', flag: '🇰🇪', localName: 'Kenya', numericCode: '404' },
  { name: 'Kiribati', code: 'KI', iso3: 'KIR', dialCode: '+686', flag: '🇰🇮', localName: 'Kiribati', numericCode: '296' },
  { name: 'Kosovo', code: 'XK', iso3: 'XKX', dialCode: '+383', flag: '🇽🇰', localName: 'Kosova', numericCode: '000' },
  { name: 'Kuwait', code: 'KW', iso3: 'KWT', dialCode: '+965', flag: '🇰🇼', localName: 'Al-Kuwayt', numericCode: '414' },
  { name: 'Kyrgyzstan', code: 'KG', iso3: 'KGZ', dialCode: '+996', flag: '🇰🇬', localName: 'Kyrgyzstan', numericCode: '417' },

  { name: 'Laos', code: 'LA', iso3: 'LAO', dialCode: '+856', flag: '🇱🇦', localName: 'Lao', numericCode: '418' },
  { name: 'Latvia', code: 'LV', iso3: 'LVA', dialCode: '+371', flag: '🇱🇻', localName: 'Latvija', numericCode: '428' },
  { name: 'Lebanon', code: 'LB', iso3: 'LBN', dialCode: '+961', flag: '🇱🇧', localName: 'Lubnān', numericCode: '422' },
  { name: 'Lesotho', code: 'LS', iso3: 'LSO', dialCode: '+266', flag: '🇱🇸', localName: 'Lesotho', numericCode: '426' },
  { name: 'Liberia', code: 'LR', iso3: 'LBR', dialCode: '+231', flag: '🇱🇷', localName: 'Liberia', numericCode: '430' },
  { name: 'Libya', code: 'LY', iso3: 'LBY', dialCode: '+218', flag: '🇱🇾', localName: 'Lībiya', numericCode: '434' },
  { name: 'Liechtenstein', code: 'LI', iso3: 'LIE', dialCode: '+423', flag: '🇱🇮', localName: 'Liechtenstein', numericCode: '438' },
  { name: 'Lithuania', code: 'LT', iso3: 'LTU', dialCode: '+370', flag: '🇱🇹', localName: 'Lietuva', numericCode: '440' },
  { name: 'Luxembourg', code: 'LU', iso3: 'LUX', dialCode: '+352', flag: '🇱🇺', localName: 'Luxembourg', numericCode: '442' },

  { name: 'Macao', code: 'MO', iso3: 'MAC', dialCode: '+853', flag: '🇲🇴', localName: 'Macau', numericCode: '446' },
  { name: 'Madagascar', code: 'MG', iso3: 'MDG', dialCode: '+261', flag: '🇲🇬', localName: 'Madagasikara', numericCode: '450' },
  { name: 'Malawi', code: 'MW', iso3: 'MWI', dialCode: '+265', flag: '🇲🇼', localName: 'Malawi', numericCode: '454' },
  { name: 'Malaysia', code: 'MY', iso3: 'MYS', dialCode: '+60', flag: '🇲🇾', localName: 'Malaysia', numericCode: '458' },
  { name: 'Maldives', code: 'MV', iso3: 'MDV', dialCode: '+960', flag: '🇲🇻', localName: 'Dhivehi Raajje', numericCode: '462' },
  { name: 'Mali', code: 'ML', iso3: 'MLI', dialCode: '+223', flag: '🇲🇱', localName: 'Mali', numericCode: '466' },
  { name: 'Malta', code: 'MT', iso3: 'MLT', dialCode: '+356', flag: '🇲🇹', localName: 'Malta', numericCode: '470' },
  { name: 'Marshall Islands', code: 'MH', iso3: 'MHL', dialCode: '+692', flag: '🇲🇭', localName: 'M̧ajeļ', numericCode: '584' },
  { name: 'Martinique', code: 'MQ', iso3: 'MTQ', dialCode: '+596', flag: '🇲🇶', localName: 'Martinique', numericCode: '474' },
  { name: 'Mauritania', code: 'MR', iso3: 'MRT', dialCode: '+222', flag: '🇲🇷', localName: 'Mūrītāniyā', numericCode: '478' },
  { name: 'Mauritius', code: 'MU', iso3: 'MUS', dialCode: '+230', flag: '🇲🇺', localName: 'Maurice', numericCode: '480' },
  { name: 'Mayotte', code: 'YT', iso3: 'MYT', dialCode: '+262', flag: '🇾🇹', localName: 'Mayotte', numericCode: '175' },
  { name: 'Mexico', code: 'MX', iso3: 'MEX', dialCode: '+52', flag: '🇲🇽', localName: 'México', numericCode: '484' },
  { name: 'Micronesia', code: 'FM', iso3: 'FSM', dialCode: '+691', flag: '🇫🇲', localName: 'Micronesia', numericCode: '583' },
  { name: 'Moldova', code: 'MD', iso3: 'MDA', dialCode: '+373', flag: '🇲🇩', localName: 'Moldova', numericCode: '498' },
  { name: 'Monaco', code: 'MC', iso3: 'MCO', dialCode: '+377', flag: '🇲🇨', localName: 'Monaco', numericCode: '492' },
  { name: 'Mongolia', code: 'MN', iso3: 'MNG', dialCode: '+976', flag: '🇲🇳', localName: 'Mongol Uls', numericCode: '496' },
  { name: 'Montenegro', code: 'ME', iso3: 'MNE', dialCode: '+382', flag: '🇲🇪', localName: 'Crna Gora', numericCode: '499' },
  { name: 'Montserrat', code: 'MS', iso3: 'MSR', dialCode: '+1', flag: '🇲🇸', localName: 'Montserrat', numericCode: '500' },
  { name: 'Morocco', code: 'MA', iso3: 'MAR', dialCode: '+212', flag: '🇲🇦', localName: 'Al-Maghrib', numericCode: '504' },
  { name: 'Mozambique', code: 'MZ', iso3: 'MOZ', dialCode: '+258', flag: '🇲🇿', localName: 'Moçambique', numericCode: '508' },
  { name: 'Myanmar (Burma)', code: 'MM', iso3: 'MMR', dialCode: '+95', flag: '🇲🇲', localName: 'Myanmar', numericCode: '104' },

  { name: 'Namibia', code: 'NA', iso3: 'NAM', dialCode: '+264', flag: '🇳🇦', localName: 'Namibia', numericCode: '516' },
  { name: 'Nauru', code: 'NR', iso3: 'NRU', dialCode: '+674', flag: '🇳🇷', localName: 'Naoero', numericCode: '520' },
  { name: 'Nepal', code: 'NP', iso3: 'NPL', dialCode: '+977', flag: '🇳🇵', localName: 'Nepāl', numericCode: '524' },
  { name: 'Netherlands', code: 'NL', iso3: 'NLD', dialCode: '+31', flag: '🇳🇱', localName: 'Nederland', numericCode: '528' },
  { name: 'New Caledonia', code: 'NC', iso3: 'NCL', dialCode: '+687', flag: '🇳🇨', localName: 'Nouvelle-Calédonie', numericCode: '540' },
  { name: 'New Zealand', code: 'NZ', iso3: 'NZL', dialCode: '+64', flag: '🇳🇿', localName: 'New Zealand', numericCode: '554' },
  { name: 'Nicaragua', code: 'NI', iso3: 'NIC', dialCode: '+505', flag: '🇳🇮', localName: 'Nicaragua', numericCode: '558' },
  { name: 'Niger', code: 'NE', iso3: 'NER', dialCode: '+227', flag: '🇳🇪', localName: 'Niger', numericCode: '562' },
  { name: 'Nigeria', code: 'NG', iso3: 'NGA', dialCode: '+234', flag: '🇳🇬', localName: 'Nigeria', numericCode: '566' },
  { name: 'North Korea', code: 'KP', iso3: 'PRK', dialCode: '+850', flag: '🇰🇵', localName: 'Chosŏn', numericCode: '408' },
  { name: 'North Macedonia', code: 'MK', iso3: 'MKD', dialCode: '+389', flag: '🇲🇰', localName: 'Severna Makedonija', numericCode: '807' },
  { name: 'Norway', code: 'NO', iso3: 'NOR', dialCode: '+47', flag: '🇳🇴', localName: 'Norge', numericCode: '578' },

  { name: 'Oman', code: 'OM', iso3: 'OMN', dialCode: '+968', flag: '🇴🇲', localName: 'ʻUmān', numericCode: '512' },

  { name: 'Pakistan', code: 'PK', iso3: 'PAK', dialCode: '+92', flag: '🇵🇰', localName: 'Pākistān', numericCode: '586' },
  { name: 'Palau', code: 'PW', iso3: 'PLW', dialCode: '+680', flag: '🇵🇼', localName: 'Belau', numericCode: '585' },
  { name: 'Palestine', code: 'PS', iso3: 'PSE', dialCode: '+970', flag: '🇵🇸', localName: 'Filasṭīn', numericCode: '275' },
  { name: 'Panama', code: 'PA', iso3: 'PAN', dialCode: '+507', flag: '🇵🇦', localName: 'Panamá', numericCode: '591' },
  { name: 'Papua New Guinea', code: 'PG', iso3: 'PNG', dialCode: '+675', flag: '🇵🇬', localName: 'Papua New Guinea', numericCode: '598' },
  { name: 'Paraguay', code: 'PY', iso3: 'PRY', dialCode: '+595', flag: '🇵🇾', localName: 'Paraguay', numericCode: '600' },
  { name: 'Peru', code: 'PE', iso3: 'PER', dialCode: '+51', flag: '🇵🇪', localName: 'Perú', numericCode: '604' },
  { name: 'Philippines', code: 'PH', iso3: 'PHL', dialCode: '+63', flag: '🇵🇭', localName: 'Pilipinas', numericCode: '608' },
  { name: 'Poland', code: 'PL', iso3: 'POL', dialCode: '+48', flag: '🇵🇱', localName: 'Polska', numericCode: '616' },
  { name: 'Portugal', code: 'PT', iso3: 'PRT', dialCode: '+351', flag: '🇵🇹', localName: 'Portugal', numericCode: '620' },
  { name: 'Puerto Rico', code: 'PR', iso3: 'PRI', dialCode: '+1', flag: '🇵🇷', localName: 'Puerto Rico', numericCode: '630' },

  { name: 'Qatar', code: 'QA', iso3: 'QAT', dialCode: '+974', flag: '🇶🇦', localName: 'Qaṭar', numericCode: '634' },

  { name: 'Romania', code: 'RO', iso3: 'ROU', dialCode: '+40', flag: '🇷🇴', localName: 'România', numericCode: '642' },
  { name: 'Russia', code: 'RU', iso3: 'RUS', dialCode: '+7', flag: '🇷🇺', localName: 'Rossiya', numericCode: '643' },
  { name: 'Rwanda', code: 'RW', iso3: 'RWA', dialCode: '+250', flag: '🇷🇼', localName: 'Rwanda', numericCode: '646' },
  { name: 'Réunion', code: 'RE', iso3: 'REU', dialCode: '+262', flag: '🇷🇪', localName: 'La Réunion', numericCode: '638' },

  { name: 'Saint Kitts and Nevis', code: 'KN', iso3: 'KNA', dialCode: '+1', flag: '🇰🇳', localName: 'Saint Kitts and Nevis', numericCode: '659' },
  { name: 'Saint Lucia', code: 'LC', iso3: 'LCA', dialCode: '+1', flag: '🇱🇨', localName: 'Saint Lucia', numericCode: '662' },
  { name: 'Saint Martin', code: 'MF', iso3: 'MAF', dialCode: '+590', flag: '🇲🇫', localName: 'Saint-Martin', numericCode: '663' },
  { name: 'Saint Pierre and Miquelon', code: 'PM', iso3: 'SPM', dialCode: '+508', flag: '🇵🇲', localName: 'Saint-Pierre-et-Miquelon', numericCode: '666' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC', iso3: 'VCT', dialCode: '+1', flag: '🇻🇨', localName: 'Saint Vincent', numericCode: '670' },
  { name: 'Samoa', code: 'WS', iso3: 'WSM', dialCode: '+685', flag: '🇼🇸', localName: 'Samoa', numericCode: '882' },
  { name: 'San Marino', code: 'SM', iso3: 'SMR', dialCode: '+378', flag: '🇸🇲', localName: 'San Marino', numericCode: '674' },
  { name: 'Saudi Arabia', code: 'SA', iso3: 'SAU', dialCode: '+966', flag: '🇸🇦', localName: 'Al-ʻArabiyyah', numericCode: '682' },
  { name: 'Senegal', code: 'SN', iso3: 'SEN', dialCode: '+221', flag: '🇸🇳', localName: 'Sénégal', numericCode: '686' },
  { name: 'Serbia', code: 'RS', iso3: 'SRB', dialCode: '+381', flag: '🇷🇸', localName: 'Srbija', numericCode: '688' },
  { name: 'Seychelles', code: 'SC', iso3: 'SYC', dialCode: '+248', flag: '🇸🇨', localName: 'Seychelles', numericCode: '690' },
  { name: 'Sierra Leone', code: 'SL', iso3: 'SLE', dialCode: '+232', flag: '🇸🇱', localName: 'Sierra Leone', numericCode: '694' },
  { name: 'Singapore', code: 'SG', iso3: 'SGP', dialCode: '+65', flag: '🇸🇬', localName: 'Singapore', numericCode: '702' },
  { name: 'Slovakia', code: 'SK', iso3: 'SVK', dialCode: '+421', flag: '🇸🇰', localName: 'Slovensko', numericCode: '703' },
  { name: 'Slovenia', code: 'SI', iso3: 'SVN', dialCode: '+386', flag: '🇸🇮', localName: 'Slovenija', numericCode: '705' },
  { name: 'Solomon Islands', code: 'SB', iso3: 'SLB', dialCode: '+677', flag: '🇸🇧', localName: 'Solomon Islands', numericCode: '090' },
  { name: 'Somalia', code: 'SO', iso3: 'SOM', dialCode: '+252', flag: '🇸🇴', localName: 'Soomaaliya', numericCode: '706' },
  { name: 'South Africa', code: 'ZA', iso3: 'ZAF', dialCode: '+27', flag: '🇿🇦', localName: 'South Africa', numericCode: '710' },
  { name: 'South Korea', code: 'KR', iso3: 'KOR', dialCode: '+82', flag: '🇰🇷', localName: 'Hanguk', numericCode: '410' },
  { name: 'South Sudan', code: 'SS', iso3: 'SSD', dialCode: '+211', flag: '🇸🇸', localName: 'South Sudan', numericCode: '728' },
  { name: 'Spain', code: 'ES', iso3: 'ESP', dialCode: '+34', flag: '🇪🇸', localName: 'España', numericCode: '724' },
  { name: 'Sri Lanka', code: 'LK', iso3: 'LKA', dialCode: '+94', flag: '🇱🇰', localName: 'Sri Lanka', numericCode: '144' },
  { name: 'Sudan', code: 'SD', iso3: 'SDN', dialCode: '+249', flag: '🇸🇩', localName: 'As-Sūdān', numericCode: '729' },
  { name: 'Suriname', code: 'SR', iso3: 'SUR', dialCode: '+597', flag: '🇸🇷', localName: 'Suriname', numericCode: '740' },
  { name: 'Sweden', code: 'SE', iso3: 'SWE', dialCode: '+46', flag: '🇸🇪', localName: 'Sverige', numericCode: '752' },
  { name: 'Switzerland', code: 'CH', iso3: 'CHE', dialCode: '+41', flag: '🇨🇭', localName: 'Schweiz / Suisse', numericCode: '756' },
  { name: 'Syria', code: 'SY', iso3: 'SYR', dialCode: '+963', flag: '🇸🇾', localName: 'Sūriyā', numericCode: '760' },
  { name: 'São Tomé and Príncipe', code: 'ST', iso3: 'STP', dialCode: '+239', flag: '🇸🇹', localName: 'São Tomé', numericCode: '678' },

  { name: 'Taiwan', code: 'TW', iso3: 'TWN', dialCode: '+886', flag: '🇹🇼', localName: 'Táiwān', numericCode: '158' },
  { name: 'Tajikistan', code: 'TJ', iso3: 'TJK', dialCode: '+992', flag: '🇹🇯', localName: 'Tojikiston', numericCode: '762' },
  { name: 'Tanzania', code: 'TZ', iso3: 'TZA', dialCode: '+255', flag: '🇹🇿', localName: 'Tanzania', numericCode: '834' },
  { name: 'Thailand', code: 'TH', iso3: 'THA', dialCode: '+66', flag: '🇹🇭', localName: 'Mueang Thai', numericCode: '764' },
  { name: 'Timor-Leste', code: 'TL', iso3: 'TLS', dialCode: '+670', flag: '🇹🇱', localName: 'Timor-Leste', numericCode: '626' },
  { name: 'Togo', code: 'TG', iso3: 'TGO', dialCode: '+228', flag: '🇹🇬', localName: 'Togo', numericCode: '768' },
  { name: 'Tonga', code: 'TO', iso3: 'TON', dialCode: '+676', flag: '🇹🇴', localName: 'Tonga', numericCode: '776' },
  { name: 'Trinidad and Tobago', code: 'TT', iso3: 'TTO', dialCode: '+1', flag: '🇹🇹', localName: 'Trinidad and Tobago', numericCode: '780' },
  { name: 'Tunisia', code: 'TN', iso3: 'TUN', dialCode: '+216', flag: '🇹🇳', localName: 'Tūnis', numericCode: '788' },
  { name: 'Turkey', code: 'TR', iso3: 'TUR', dialCode: '+90', flag: '🇹🇷', localName: 'Türkiye', numericCode: '792' },
  { name: 'Turkmenistan', code: 'TM', iso3: 'TKM', dialCode: '+993', flag: '🇹🇲', localName: 'Türkmenistan', numericCode: '795' },
  { name: 'Turks and Caicos Islands', code: 'TC', iso3: 'TCA', dialCode: '+1', flag: '🇹🇨', localName: 'Turks and Caicos', numericCode: '796' },
  { name: 'Tuvalu', code: 'TV', iso3: 'TUV', dialCode: '+688', flag: '🇹🇻', localName: 'Tuvalu', numericCode: '798' },

  { name: 'Uganda', code: 'UG', iso3: 'UGA', dialCode: '+256', flag: '🇺🇬', localName: 'Uganda', numericCode: '800' },
  { name: 'Ukraine', code: 'UA', iso3: 'UKR', dialCode: '+380', flag: '🇺🇦', localName: 'Ukraïna', numericCode: '804' },
  { name: 'United Arab Emirates', code: 'AE', iso3: 'ARE', dialCode: '+971', flag: '🇦🇪', localName: 'Al-Imārāt', numericCode: '784' },
  { name: 'United Kingdom', code: 'GB', iso3: 'GBR', dialCode: '+44', flag: '🇬🇧', localName: 'United Kingdom', numericCode: '826' },
  { name: 'United States', code: 'US', iso3: 'USA', dialCode: '+1', flag: '🇺🇸', localName: 'United States', numericCode: '840' },
  { name: 'Uruguay', code: 'UY', iso3: 'URY', dialCode: '+598', flag: '🇺🇾', localName: 'Uruguay', numericCode: '858' },
  { name: 'Uzbekistan', code: 'UZ', iso3: 'UZB', dialCode: '+998', flag: '🇺🇿', localName: 'Oʻzbekiston', numericCode: '860' },

  { name: 'Vanuatu', code: 'VU', iso3: 'VUT', dialCode: '+678', flag: '🇻🇺', localName: 'Vanuatu', numericCode: '548' },
  { name: 'Vatican City', code: 'VA', iso3: 'VAT', dialCode: '+39', flag: '🇻🇦', localName: 'Città del Vaticano', numericCode: '336' },
  { name: 'Venezuela', code: 'VE', iso3: 'VEN', dialCode: '+58', flag: '🇻🇪', localName: 'Venezuela', numericCode: '862' },
  { name: 'Vietnam', code: 'VN', iso3: 'VNM', dialCode: '+84', flag: '🇻🇳', localName: 'Việt Nam', numericCode: '704' },

  { name: 'Yemen', code: 'YE', iso3: 'YEM', dialCode: '+967', flag: '🇾🇪', localName: 'Al-Yaman', numericCode: '887' },

  { name: 'Zambia', code: 'ZM', iso3: 'ZMB', dialCode: '+260', flag: '🇿🇲', localName: 'Zambia', numericCode: '894' },
  { name: 'Zimbabwe', code: 'ZW', iso3: 'ZWE', dialCode: '+263', flag: '🇿🇼', localName: 'Zimbabwe', numericCode: '716' }
];

/**
 * Returns the worldwide country list automatically sorted alphabetically in English.
 */
export const WORLD_COUNTRIES = RAW_COUNTRIES.slice().sort((a, b) =>
  a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
);

/**
 * Get country by ISO2 code ("BJ", "FR", "US", etc.)
 */
export const getCountryByCode = (code) => {
  if (!code) return WORLD_COUNTRIES[0];
  const upper = String(code).trim().toUpperCase();
  return WORLD_COUNTRIES.find((c) => c.code === upper) || WORLD_COUNTRIES[0];
};

/**
 * Get country by international dial code ("+229", "+33", etc.)
 */
export const getCountryByDialCode = (dialCode) => {
  if (!dialCode) return WORLD_COUNTRIES[0];
  const clean = dialCode.startsWith('+') ? dialCode : '+' + dialCode.trim();
  return WORLD_COUNTRIES.find((c) => c.dialCode === clean) || WORLD_COUNTRIES[0];
};

/**
 * Smart country search algorithm.
 * Matches:
 * - Country Name ("france", "benin", "united states")
 * - Dial Code ("+229", "229", "+33")
 * - ISO Code ("BJ", "FR", "USA")
 * - Partial match ("nig", "fran")
 */
export const searchCountries = (query) => {
  if (!query || !query.trim()) return WORLD_COUNTRIES;
  const q = query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const digitsOnly = query.replace(/\D/g, '');

  return WORLD_COUNTRIES.filter((c) => {
    const nameNorm = c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const localNorm = (c.localName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const codeNorm = c.code.toLowerCase();
    const iso3Norm = c.iso3.toLowerCase();
    const dialClean = c.dialCode.replace('+', '');

    return (
      nameNorm.includes(q) ||
      localNorm.includes(q) ||
      codeNorm === q ||
      iso3Norm === q ||
      c.dialCode.includes(q) ||
      (digitsOnly && dialClean.includes(digitsOnly))
    );
  });
};
