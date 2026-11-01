// Stock photography used when a theatre hasn't uploaded its own photos (cinema/) or
// menu-item photos (food/), served from public/images/<folder>/.
// All images are from Wikimedia Commons under the licences listed here.
export interface PhotoCredit { file: string; folder?: "cinema" | "food"; title: string; author: string; license: string; licenseUrl: string; source: string }

export const PHOTO_CREDITS: PhotoCredit[] = [
  {
    "file": "auditorium-1.jpg",
    "title": "Auditorium at Gilda on an afternoon in January 2025.jpg",
    "author": "JIP",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Auditorium_at_Gilda_on_an_afternoon_in_January_2025.jpg"
  },
  {
    "file": "auditorium-2.jpg",
    "title": "Auditorium at Maxim in May 2024.jpg",
    "author": "JIP",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Auditorium_at_Maxim_in_May_2024.jpg"
  },
  {
    "file": "auditorium-3.jpg",
    "title": "New seats installed - Cinema 2 completed.jpg",
    "author": "Iantroberts",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:New_seats_installed_-_Cinema_2_completed.jpg"
  },
  {
    "file": "auditorium-4.jpg",
    "title": "KCC Cotabato Cinema Atmos.jpg",
    "author": "JuneDosporDos",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:KCC_Cotabato_Cinema_Atmos.jpg"
  },
  {
    "file": "auditorium-5.jpg",
    "title": "Sala MEGA Dolby Atmos Via Sul Centerplex.jpg",
    "author": "Almaidany",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Sala_MEGA_Dolby_Atmos_Via_Sul_Centerplex.jpg"
  },
  {
    "file": "auditorium-6.jpg",
    "title": "Columbia City Cinema main hall.jpg",
    "author": "Joe Mabel",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Columbia_City_Cinema_main_hall.jpg"
  },
  {
    "file": "auditorium-7.jpg",
    "title": "Installatie VIP-stoelen Vue Hoorn.jpg",
    "author": "Thomasmachtel",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Installatie_VIP-stoelen_Vue_Hoorn.jpg"
  },
  {
    "file": "lobby-1.jpg",
    "title": "Lobby of Vue Cinema Longwell Green, Bristol - January 2026.jpg",
    "author": "Captain Galaxy",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Lobby_of_Vue_Cinema_Longwell_Green,_Bristol_-_January_2026.jpg"
  },
  {
    "file": "recliners.jpg",
    "title": "Luxury Movie Theater Seats.jpg",
    "author": "Author0612",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Luxury_Movie_Theater_Seats.jpg"
  },
  {
    "file": "food-court.jpg",
    "title": "Playhouse Cinema Hamilton, Ontario, Canada Concession Stand.png",
    "author": "Stephanuniverse",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:Playhouse_Cinema_Hamilton,_Ontario,_Canada_Concession_Stand.png"
  },
  {
    "file": "imax.jpg",
    "title": "Interior of IMAX cinema in Lahore 1.jpg",
    "author": "Shahzaib Damn Cruze",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Interior_of_IMAX_cinema_in_Lahore_1.jpg"
  },
  {
    "file": "dolby-atmos.jpg",
    "title": "Sala MEGA Dolby Atmos Via Sul Centerplex.jpg",
    "author": "Almaidany",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Sala_MEGA_Dolby_Atmos_Via_Sul_Centerplex.jpg"
  },
  {
    "file": "lounge.jpg",
    "title": "Bar & lounge area of Palace on Wheels Luxury Train India.jpg",
    "author": "Photos Worldwide",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:Bar_%26_lounge_area_of_Palace_on_Wheels_Luxury_Train_India.jpg"
  },
  {
    "file": "parking.jpg",
    "title": "Crossroads Mall Parking Garage.jpg",
    "author": "WiinterU",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:Crossroads_Mall_Parking_Garage.jpg"
  },
  {
    "file": "snacks.jpg",
    "title": "Popcorn 2.jpg",
    "author": "ProjectManhattan",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Popcorn_2.jpg"
  },
  {
    "file": "popcorn-salted.jpg",
    "folder": "food",
    "title": "Popcorn in bucket.jpg",
    "author": "Corn cheese",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Popcorn_in_bucket.jpg"
  },
  {
    "file": "popcorn-caramel.jpg",
    "folder": "food",
    "title": "Caramel Corn at Karamell-Küche.jpg",
    "author": "U+1F360",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Caramel_Corn_at_Karamell-K%C3%BCche.jpg"
  },
  {
    "file": "popcorn-cheese.jpg",
    "folder": "food",
    "title": "Smartfood White Cheddar Cheese Popcorn plate 3 February 2025 Philippines1.jpg",
    "author": "Valenzuela400",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Smartfood_White_Cheddar_Cheese_Popcorn_plate_3_February_2025_Philippines1.jpg"
  },
  {
    "file": "combo.jpg",
    "folder": "food",
    "title": "Cinema popcorn bucket.jpg",
    "author": "مانفی",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Cinema_popcorn_bucket.jpg"
  },
  {
    "file": "nachos.jpg",
    "folder": "food",
    "title": "Nachos-cheese (cropped).jpg",
    "author": "chee.hong from Kuala Lumpur, Malaysia",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Nachos-cheese_(cropped).jpg"
  },
  {
    "file": "fries.jpg",
    "folder": "food",
    "title": "Hesburger French fries on a plate.jpg",
    "author": "JIP",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Hesburger_French_fries_on_a_plate.jpg"
  },
  {
    "file": "burger.jpg",
    "folder": "food",
    "title": "Grilled Hey Pesto Chicken Burger - Gourmet Burger Kitchen 2023-10-03.jpg",
    "author": "Andy Li",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:Grilled_Hey_Pesto_Chicken_Burger_-_Gourmet_Burger_Kitchen_2023-10-03.jpg"
  },
  {
    "file": "sandwich.jpg",
    "folder": "food",
    "title": "Vegetable Sandwich - Kolkata 2013-09-24 3217.JPG",
    "author": "Biswarup Ganguly",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Vegetable_Sandwich_-_Kolkata_2013-09-24_3217.JPG"
  },
  {
    "file": "samosa.jpg",
    "folder": "food",
    "title": "Samosa with tamarind chutney and tomato sauce.jpg",
    "author": "Madhura Vaze",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Samosa_with_tamarind_chutney_and_tomato_sauce.jpg"
  },
  {
    "file": "hotdog.jpg",
    "folder": "food",
    "title": "Hot dog with two sausages, 2025-11-29.jpg",
    "author": "Hekatlys",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:Hot_dog_with_two_sausages,_2025-11-29.jpg"
  },
  {
    "file": "cola.jpg",
    "folder": "food",
    "title": "Glass cola.jpg",
    "author": "pic_p_ter",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:Glass_cola.jpg"
  },
  {
    "file": "cold-coffee.jpg",
    "folder": "food",
    "title": "Homemade Cold Coffee(Indian Style)- Kolkata.jpg",
    "author": "TAPAS KUMAR HALDER",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Homemade_Cold_Coffee(Indian_Style)-_Kolkata.jpg"
  },
  {
    "file": "water.jpg",
    "folder": "food",
    "title": "Blue Waters bottle no label.jpg",
    "author": "999real",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:Blue_Waters_bottle_no_label.jpg"
  },
  {
    "file": "chai.jpg",
    "folder": "food",
    "title": "Masala Chai.JPG",
    "author": "Miansari66",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:Masala_Chai.JPG"
  },
  {
    "file": "brownie.jpg",
    "folder": "food",
    "title": "Brownie IMG 001.jpg",
    "author": "Phadke09",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Brownie_IMG_001.jpg"
  },
  {
    "file": "ice-cream.jpg",
    "folder": "food",
    "title": "Ice cream in cup with sprinkles and spoon.jpg",
    "author": "Leah Kelley at Pexels",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:Ice_cream_in_cup_with_sprinkles_and_spoon.jpg"
  }
];
