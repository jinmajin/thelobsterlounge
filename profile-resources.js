var profileResources = {
  // Jeff Profile Info
  jazzyJeff: {
    profileName: "Jazzy Jeff's Jumpin' Jam",
    location: "Cambridge, MA",
    genre: "Music",
    quote: '"To play is to live"',
    aboutMe: "I've been playing jazz in the Boston area for about 7 years now. " +
      "Before that, I used to play in Central Park NYC for 12 years. I love playing the guitar and the piano.",
    upcomingPerformances: [
      {date: {month: "05", day: "06", year: "2015"}, location: "Harvard Square", details: "I'll be playing my piano in the middle of the square from 5:00pm to 9:00pm"},
      {date: {month: "05", day: "07", year: "2015"}, location: "Kendall Station", details: "I'll play my guitar on the inbound platform all day long"},
      {date: {month: "05", day: "09", year: "2015"}, location: "Boston Common Park", details: "I'll be playing guitar by the green line station entrance"}
    ],
    media: [
      {type: 'video', src: "assets/video/jazzyJeff/jazzyJeff1.mp4"},
      {type: 'image', src: "assets/image/jazzyJeff/jazzyJeff1.jpg"},
      {type: 'image', src: "assets/image/jazzyJeff/jazzyJeff2.jpg"},
      {type: 'image', src: "assets/image/jazzyJeff/jazzyJeff3.jpg"},
      {type: 'image', src: "assets/image/jazzyJeff/jazzyJeff4.jpg"},
      {type: 'image', src: "assets/image/jazzyJeff/jazzyJeff5.jpg"},
    ],
    profilePic: {src: "assets/image/jazzyJeff/jazzyJeffProfile.png"},
    following: ["usTheDuo", "jugglingGeorge"],
    messages: [
      {from: "usTheDuo", body: "Hey Jeff! We'd love to have you join our band! Come meet us this sunday"},
      {from: "acrobaticAdam", body: "I saw you perform last Saturday. Love your work bro!"},
    ],
    shortVids: [{src: 'assets/short/jazzyJeff1.mp4'},
    {src:'assets/short/jazzyJeff2.mp4'}],
  },

  // Us The Duo Profile Info
  usTheDuo: {
    profileName: "Us The Duo",
    location: "New York, NY",
    genre: "Music",
    quote: '"We like to play music"',
    aboutMe: "Three years ago, two emerging solo artists from opposite sides of the country randomly collided, fell in love, and combined their talents to form Us The Duo. A few successful YouTube videos (28+ million views) encouraged these pop songwriters to write their own music together, leading them to produce their first self-titled album. After its release, Michael & Carissa got married and have been traveling and playing music together ever since.",
    upcomingPerformances: [
      {date: {month: "05", day: "06", year: "2015"}, location: "Museum of Arts & Design", details: "We'll be playing some wicked sweet jams in front of the Museum."},
      {date: {month: "05", day: "08", year: "2015"}, location: "Central Park", details: "We'll be playing some moderately tasty jams."},
    ],
    media: [
      {type: 'video', src: "assets/video/usTheDuo/usTheDuo1.mp4"},
      {type: 'video', src: "assets/video/usTheDuo/usTheDuo2.mp4"},
      {type: 'video', src: "assets/video/usTheDuo/usTheDuo3.mp4"},
      {type: 'image', src: "assets/image/usTheDuo/usTheDuo1.jpg"},
    ],
    profilePic: {src: "assets/image/usTheDuo/usTheDuoProfile.jpg"},
    shortVids: [{src:'assets/short/usTheDuo1.mp4'}, 
    {src: 'assets/short/usTheDuo2.mp4'}, 
    {src: 'assets/short/usTheDuo3.mp4'}],
  },

  // Juggling George's Profile
  jugglingGeorge: {
    profileName: "Juggling George",
    location: "Cambridge, MA",
    genre: "Juggling",
    quote: '"Jugglin\' all day every day"',
    aboutMe: "I've been juggling for 47 years now. I started in my youth, and it has brought me to where I am today. I don't see juggling as a hobby so much as a way of life. I encourage you to join me. Join the revolution!",
    upcomingPerformances: [
      {date: {month:"05", day: "07", year: "2015"}, location: "Kendall Square", details: "I'll be juggling and playing my piano in the outbound side of the T-station."},
      {date: {month:"05", day: "08", year: "2015"}, location: "MIT Kresge Auditorium", details: "I'll be joining the MIT Juggling Club to do some amazing juggling."},
    ],
    media: [
      {type: 'video', src: "assets/video/jugglingGeorge/jugglingGeorge1.mp4"},
      {type: 'video', src: "assets/video/jugglingGeorge/jugglingGeorge2.mp4"},
      {type: 'image', src: "assets/image/jugglingGeorge/jugglingGeorge1.jpg"},
    ],
    profilePic: {src: "assets/image/jugglingGeorge/jugglingGeorgeProfile.jpg"},
    shortVids: [{src:'assets/short/jugglingGeorge1.mp4'}, 
    {src: 'assets/short/jugglingGeorge2.mp4'}, 
    {src: 'assets/short/jugglingGeorge3.mp4'}],
  },

  // Acrobatic Adam's Profile
  acrobaticAdam: {
    profileName: "Acrobatic Adam",
    location: "New York, NY",
    genre: "Acrobatics",
    quote: '"I like to jump over things"',
    aboutMe: "I've been into acrobatics for 10 years. I enjoy jumping, flipping, and free-running. Come watch me to cool things with gravity and rotational inertia.",
    upcomingPerformances: [
      {date: {month:"05", day: "06", year: "2015"}, location: "Battery Park", details: "Me and the NYC Acrobatics Street Performers group will be doing some sweet stunts."},
      {date: {month:"05", day: "09", year: "2015"}, location: "Rockefeller Center", details: "I'll be jumping over more things in front of the Rockefeller Center."},
    ],
    media: [
      {type: 'video', src: "assets/video/acrobaticAdam/acrobaticAdam1.mp4"},
      {type: 'video', src: "assets/video/acrobaticAdam/acrobaticAdam2.mp4"},
      {type: 'image', src: "assets/image/acrobaticAdam/acrobaticAdam1.jpg"},
    ],
    profilePic: {src: "assets/image/acrobaticAdam/acrobaticAdamProfile.jpg"},
    shortVids: [{src: 'assets/short/acrobaticAdam1.mp4'}, 
    {src:'assets/short/acrobaticAdam2.mp4'}, 
    {src:'assets/short/acrobaticAdam3.mp4'}],
  },
};
