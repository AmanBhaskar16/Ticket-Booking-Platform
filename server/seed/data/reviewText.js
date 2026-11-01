// Review copy, grouped by how much the reviewer liked the film. `{m}` is replaced with
// the movie's name. Openers and genre lines are mixed so no two reviews read alike.
export const MOVIE_OPENERS = {
    rave: [
        "Absolute masterpiece. {m} is the kind of film you watch on the biggest screen you can find.",
        "Watched {m} twice in the same week and would go again. Goosebumps every single time.",
        "Paisa vasool from the first frame to the last. The interval block alone is worth the ticket.",
        "One of the best theatrical experiences I've had in years. The whole hall was clapping at the end.",
        "{m} lives up to every bit of the hype. Performances, music, visuals — everything clicks.",
        "Kya film hai! Went in with high expectations and still came out stunned.",
        "Rarely does a film hit this hard emotionally. Carried {m} home with me for days.",
        "Perfect blend of story and spectacle. Don't wait for OTT, this one is made for theatres.",
        "Lead performance is career-best stuff. Easily a 10 from me.",
        "Every department is firing here — writing, background score, cinematography. Loved it.",
    ],
    good: [
        "Really enjoyed {m}. A little long in the second half but the payoff is worth it.",
        "Solid entertainer. Great performances, a couple of songs could have been trimmed.",
        "Good watch with family. Kids and parents both had a great time.",
        "{m} delivers what it promises. Not perfect, but very satisfying on the big screen.",
        "Strong first half, slightly predictable climax, still a recommended watch.",
        "Background score is the real hero. Watch it in Dolby Atmos if you can.",
        "Mazaa aa gaya. A few logic gaps here and there but who cares when it's this fun.",
        "Well made and well acted. The pacing dips in the middle but recovers nicely.",
        "Went with friends, came out discussing it for an hour. That's a good sign.",
        "Better than I expected. The cast's chemistry carries the slower portions.",
    ],
    mixed: [
        "Decent one-time watch. Great moments, but {m} feels stretched by at least 20 minutes.",
        "Visually impressive but the story didn't hold my attention throughout.",
        "Some scenes are brilliant, others fall flat. Wait for reviews from friends before going.",
        "Average film. The trailer promised more than the movie delivers.",
        "First half is fun, second half loses the plot. Climax is okay-okay.",
        "Good performances let down by a weak screenplay. Watchable if you're a fan.",
        "Not bad, not great. Music is the best part of {m}.",
    ],
    poor: [
        "Disappointed. Too long and the story goes nowhere after the interval.",
        "Expected much better from this team. Felt like a drag after the first hour.",
        "Couldn't connect with the characters at all. Skip it, or catch it on OTT.",
        "Loud, messy and way too long. A couple of good scenes don't save {m}.",
    ],
};

export const GENRE_LINES = {
    Action: ["The action choreography is top class, especially the interval fight.", "Mass moments land perfectly — whistles all around in our show."],
    Thriller: ["Kept me guessing till the very end.", "The twists are genuinely surprising and well set up."],
    Drama: ["Some scenes are so moving the whole hall went quiet.", "Very grounded and honest writing."],
    Comedy: ["Laughed till my stomach hurt. The one-liners are gold.", "Comic timing of the supporting cast is superb."],
    Horror: ["The jump scares actually work, and the comedy balances it out.", "Spooky atmosphere without ever getting too heavy."],
    Romance: ["The chemistry between the leads feels real.", "Songs are already on repeat on my playlist."],
    "Sci-Fi": ["The world-building is incredible — a must-watch in IMAX.", "VFX are on par with anything out there."],
    Fantasy: ["The scale of this world is breathtaking.", "Mythology and spectacle mixed beautifully."],
    Animation: ["Funny for kids, emotional for adults. Took tissues for nothing — needed them.", "Gorgeous animation, every frame is a painting."],
    Biography: ["Inspiring story told with a lot of restraint.", "Makes you want to read up on the real person after."],
    Adventure: ["Pure escapist fun from start to finish.", "Feels like a proper big-screen adventure."],
    Crime: ["Gritty and intense, the villain is terrific.", "The underworld setting is very well realised."],
    Musical: ["The album is the soul of this film.", "Every song moves the story forward."],
};

export const THEATRE_COMMENTS = {
    5: [
        "Spotless auditorium, super comfortable recliners and the sound is crystal clear.",
        "Best cinema in the city. Staff are polite and the F&B arrives fast.",
        "Projection is razor sharp and the seats are spacious. My go-to theatre now.",
        "Easy parking, quick entry with the M-ticket, and a lovely clean lobby.",
        "Watched in the IMAX hall — absolutely worth the premium.",
    ],
    4: [
        "Great screen and sound. Food is a bit overpriced but that's every multiplex.",
        "Clean and comfortable. The queue at the snack counter was long during interval.",
        "Good experience overall, though the AC was a little too cold.",
        "Nice seats and good sound. Parking can be a pain on weekends.",
        "Well maintained, friendly staff. Restrooms could be cleaner on busy nights.",
    ],
    3: [
        "Decent theatre. Seats in the front rows are cramped.",
        "Sound was fine but the screen looked a little dim in Audi 2.",
        "Okay experience. Ads ran for almost 20 minutes before the film started.",
    ],
    2: [
        "Show started late and the AC wasn't working properly.",
        "Seats were sticky and the sound kept cutting out in the second half.",
    ],
};
