// Rwanda Districts and Sectors Data
export interface RwandaSector {
  name: string;
}

export interface RwandaDistrict {
  name: string;
  sectors: string[];
}

export const rwandaDistricts: RwandaDistrict[] = [
  {
    name: 'Gasabo',
    sectors: ['Bumbogo', 'Gatsata', 'Jali', 'Gikomero', 'Gisozi', 'Jabana', 'Kacyiru', 'Kimihurura', 'Kimironko', 'Kinyinya', 'Ndera', 'Nduba', 'Remera', 'Rusororo', 'Rutunga']
  },
  {
    name: 'Kicukiro',
    sectors: ['Gahanga', 'Gatenga', 'Gikondo', 'Kagarama', 'Kanombe', 'Kicukiro', 'Kigarama', 'Masaka', 'Niboye', 'Nyarugunga']
  },
  {
    name: 'Nyarugenge',
    sectors: ['Gitega', 'Kanyinya', 'Kigali', 'Kimisagara', 'Mageragere', 'Muhima', 'Nyakabanda', 'Nyamirambo', 'Nyarugenge', 'Rwezamenyo']
  },
  {
    name: 'Bugesera',
    sectors: ['Gashora', 'Juru', 'Kamabuye', 'Ntarama', 'Mareba', 'Mayange', 'Musenyi', 'Mwogo', 'Ngeruka', 'Nyamata', 'Nyarugenge', 'Rilima', 'Ruhuha', 'Rweru', 'Shyara']
  },
  {
    name: 'Burera',
    sectors: ['Bungwe', 'Butaro', 'Cyanika', 'Cyeru', 'Gahunga', 'Gatebe', 'Gitovu', 'Kagogo', 'Kinoni', 'Kinyababa', 'Kivuye', 'Nemba', 'Rugarama', 'Rugendabari', 'Ruhunde', 'Rusarabuye', 'Rwerere']
  },
  {
    name: 'Gakenke',
    sectors: ['Busengo', 'Coko', 'Cyabingo', 'Gakenke', 'Gashenyi', 'Janja', 'Kamubuga', 'Karambo', 'Kivuruga', 'Mataba', 'Minazi', 'Muhondo', 'Muyongwe', 'Muzo', 'Nemba', 'Ruli', 'Rusasa', 'Rushashi', 'Shangasha']
  },
  {
    name: 'Gatsibo',
    sectors: ['Gasange', 'Gatsibo', 'Gitoki', 'Kageyo', 'Kabarore', 'Kiramuruzi', 'Kiziguro', 'Muhura', 'Murambi', 'Ngarama', 'Nyagihanga', 'Remera', 'Rugarama', 'Rwimbogo']
  },
  {
    name: 'Gicumbi',
    sectors: ['Bukure', 'Bwisige', 'Byumba', 'Cyumba', 'Giti', 'Kaniga', 'Kanyinya', 'Manyagiro', 'Miyove', 'Mukarange', 'Muko', 'Mutete', 'Nyamiyaga', 'Nyankenke', 'Rubaya', 'Rukomo', 'Rushaki', 'Rutare', 'Ruvune', 'Rwamiko', 'Shangasha']
  },
  {
    name: 'Gisagara',
    sectors: ['Gikonko', 'Gishubi', 'Kansi', 'Kibilizi', 'Kigembe', 'Mamba', 'Muganza', 'Mugombwa', 'Mukindo', 'Musha', 'Ndora', 'Nyanza', 'Save', 'Kibirizi']
  },
  {
    name: 'Huye',
    sectors: ['Gishamvu', 'Karama', 'Kigoma', 'Kinazi', 'Maraba', 'Mbazi', 'Mukura', 'Ngoma', 'Ruhashya', 'Rusatira', 'Rwaniro', 'Simbi', 'Tumba', 'Huye']
  },
  {
    name: 'Kamonyi',
    sectors: ['Gacurabwenge', 'Karama', 'Kayenzi', 'Kayumbu', 'Mugina', 'Musambira', 'Ngamba', 'Nyamiyaga', 'Nyarubaka', 'Rukoma', 'Rugarika', 'Runda']
  },
  {
    name: 'Karongi',
    sectors: ['Bwishyura', 'Gashari', 'Gishyita', 'Gisovu', 'Gitesi', 'Mubuga', 'Murambi', 'Murundi', 'Mutuntu', 'Rugabano', 'Ruganda', 'Rwankuba', 'Twumba']
  },
  {
    name: 'Kayonza',
    sectors: ['Gahini', 'Kabare', 'Kabarondo', 'Mukarange', 'Murama', 'Murundi', 'Mwiri', 'Ndego', 'Nyamirama', 'Rukara', 'Ruramira', 'Rwinkwavu']
  },
  {
    name: 'Kirehe',
    sectors: ['Gahara', 'Gatore', 'Kigarama', 'Kigina', 'Kirehe', 'Mahama', 'Mpanga', 'Musaza', 'Mushikiri', 'Nasho', 'Nyamugari', 'Nyarubuye']
  },
  {
    name: 'Muhanga',
    sectors: ['Cyeza', 'Kabacuzi', 'Kibangu', 'Kiyumba', 'Muhanga', 'Mushishiro', 'Nyabinidi', 'Nyamabuye', 'Nyarusange', 'Rongi', 'Shyogwe']
  },
  {
    name: 'Musanze',
    sectors: ['Busogo', 'Cyuve', 'Gacaca', 'Gashaki', 'Gataraga', 'Kimonyi', 'Kinigi', 'Muhoza', 'Muko', 'Musanze', 'Nkotsi', 'Nyange', 'Remera', 'Rwaza', 'Shingiro']
  },
  {
    name: 'Ngoma',
    sectors: ['Gashanda', 'Jarama', 'Karembo', 'Kazo', 'Kibungo', 'Mugesera', 'Murama', 'Mutenderi', 'Remera', 'Rukira', 'Rukumberi', 'Ruraka', 'Sake', 'Zaza']
  },
  {
    name: 'Ngororero',
    sectors: ['Bwira', 'Gatumba', 'Hindiro', 'Kabaya', 'Kageyo', 'Kavumu', 'Matyazo', 'Muhanda', 'Muhororo', 'Ndaro', 'Ngororero', 'Nyange', 'Sovu']
  },
  {
    name: 'Nyabihu',
    sectors: ['Bigogwe', 'Jenda', 'Jomba', 'Kabatwa', 'Karago', 'Kintobo', 'Mukamira', 'Muringa', 'Rambura', 'Rugera', 'Rurembo', 'Shyira']
  },
  {
    name: 'Nyagatare',
    sectors: ['Gatunda', 'Karama', 'Karangazi', 'Katabagemu', 'Kiyombe', 'Matimba', 'Mimuri', 'Mukama', 'Musheli', 'Nyagatare', 'Rukomo', 'Rwempasha', 'Rwimiyaga', 'Tabagwe']
  },
  {
    name: 'Nyamagabe',
    sectors: ['Buruhukiro', 'Cyanika', 'Gasaka', 'Gatare', 'Kaduha', 'Kamegeri', 'Kibirizi', 'Kibumbwe', 'Kitabi', 'Mbazi', 'Mugano', 'Musange', 'Musebeya', 'Mushubi', 'Nkomane', 'Tare', 'Uwinkingi']
  },
  {
    name: 'Nyamasheke',
    sectors: ['Bushekeri', 'Bushenge', 'Cyato', 'Gihombo', 'Kagano', 'Kanjongo', 'Karambi', 'Karengera', 'Kirimbi', 'Macuba', 'Mahembe', 'Nyabitekeri', 'Rangiro', 'Ruharambuga', 'Shangi']
  },
  {
    name: 'Nyanza',
    sectors: ['Busasamana', 'Busoro', 'Cyabakamyi', 'Kibirizi', 'Kigoma', 'Mukingo', 'Muyira', 'Ntyazo', 'Nyagisozi', 'Rwabicuma']
  },
  {
    name: 'Nyaruguru',
    sectors: ['Busanze', 'Cyahinda', 'Kibeho', 'Kibingo', 'Kinazi', 'Kivu', 'Mata', 'Munini', 'Ngera', 'Ngoma', 'Nyabimata', 'Nyagisozi', 'Ruheru', 'Rusenge']
  },
  {
    name: 'Rubavu',
    sectors: ['Bugeshi', 'Busasamana', 'Cyanzarwe', 'Gisenyi', 'Kanama', 'Kanzenze', 'Mudende', 'Nyakiliba', 'Nyamyumba', 'Nyundo', 'Rubavu', 'Rugerero']
  },
  {
    name: 'Ruhango',
    sectors: ['Bweramana', 'Byimana', 'Kabagali', 'Kinazi', 'Kinihira', 'Mbuye', 'Mwendo', 'Ntongwe', 'Ruhango']
  },
  {
    name: 'Rulindo',
    sectors: ['Base', 'Burega', 'Bushoki', 'Buyoga', 'Cyinzuzi', 'Cyungo', 'Kinihira', 'Kisaro', 'Masoro', 'Mbogo', 'Murambi', 'Ngoma', 'Ntarabana', 'Rukozo', 'Rusiga', 'Shyorongi', 'Tumba']
  },
  {
    name: 'Rusizi',
    sectors: ['Bugarama', 'Butare', 'Bweyeye', 'Gikundamvura', 'Giheke', 'Gihundwe', 'Gitambi', 'Kamembe', 'Muganza', 'Mururu', 'Nkanka', 'Nkombo', 'Nkungu', 'Nyakabuye', 'Nyakarenzo', 'Nzahaha', 'Rwimbogo']
  },
  {
    name: 'Rutsiro',
    sectors: ['Boneza', 'Gihango', 'Kigeyo', 'Kivumu', 'Manihira', 'Mukura', 'Murunda', 'Musasa', 'Nyabirasi', 'Ruhango', 'Rusebeya']
  },
  {
    name: 'Rwamagana',
    sectors: ['Cyanya', 'Fumbwe', 'Gahengeri', 'Gishari', 'Karenge', 'Kigabiro', 'Muhazi', 'Munyaga', 'Munyiginya', 'Musha', 'Muyumbu', 'Mwulire', 'Nyakaliro', 'Nzige', 'Rubona']
  }
];

// Helper function to get sectors for a specific district
export const getSectorsForDistrict = (districtName: string): string[] => {
  const district = rwandaDistricts.find(d => d.name === districtName);
  return district ? district.sectors : [];
};

// Helper function to get all district names
export const getAllDistrictNames = (): string[] => {
  return rwandaDistricts.map(d => d.name);
};
