-- Tinder for Movies - Seed Data
-- Run this SQL AFTER schema.sql to populate the database with sample movies
-- These are popular movies with TMDB poster URLs

-- Clear existing movies (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE movies CASCADE;

-- Insert 40 popular movies across various genres
INSERT INTO movies (title, year, poster_url, genres, description) VALUES

-- Action & Adventure
('The Dark Knight', 2008, 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', ARRAY['Action', 'Crime', 'Drama'], 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.'),

('Inception', 2010, 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', ARRAY['Action', 'Science Fiction', 'Adventure'], 'A thief who steals corporate secrets through the use of dream-sharing technology is given the task of planting an idea into the mind of a C.E.O.'),

('Mad Max: Fury Road', 2015, 'https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg', ARRAY['Action', 'Adventure', 'Science Fiction'], 'An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken.'),

('Gladiator', 2000, 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', ARRAY['Action', 'Drama', 'Adventure'], 'In the year 180, the death of emperor Marcus Aurelius throws the Roman Empire into chaos.'),

('The Matrix', 1999, 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', ARRAY['Action', 'Science Fiction'], 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.'),

-- Sci-Fi
('Interstellar', 2014, 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', ARRAY['Adventure', 'Drama', 'Science Fiction'], 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.'),

('Blade Runner 2049', 2017, 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', ARRAY['Science Fiction', 'Drama'], 'Thirty years after the events of the first film, a new blade runner unearths a long-buried secret.'),

('Arrival', 2016, 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg', ARRAY['Drama', 'Science Fiction', 'Mystery'], 'Taking place after alien crafts land around the world, an expert linguist is recruited by the military to determine whether they come in peace.'),

('Dune', 2021, 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', ARRAY['Science Fiction', 'Adventure'], 'Paul Atreides arrives on Arrakis after his father accepts the stewardship of the dangerous planet.'),

-- Drama
('The Shawshank Redemption', 1994, 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', ARRAY['Drama', 'Crime'], 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'),

('Forrest Gump', 1994, 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', ARRAY['Comedy', 'Drama', 'Romance'], 'The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man with an IQ of 75.'),

('The Godfather', 1972, 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', ARRAY['Drama', 'Crime'], 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'),

('Schindler''s List', 1993, 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', ARRAY['Drama', 'History', 'War'], 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce.'),

-- Comedy
('Pulp Fiction', 1994, 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', ARRAY['Thriller', 'Crime'], 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.'),

('The Grand Budapest Hotel', 2014, 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg', ARRAY['Comedy', 'Drama'], 'The adventures of Gustave H, a legendary concierge at a famous hotel, and Zero Moustafa, the lobby boy who becomes his trusted friend.'),

('Parasite', 2019, 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', ARRAY['Comedy', 'Thriller', 'Drama'], 'All unemployed, the Kim family takes peculiar interest in the wealthy and glamorous Parks.'),

('Knives Out', 2019, 'https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg', ARRAY['Comedy', 'Crime', 'Mystery'], 'A detective investigates the death of a patriarch of an eccentric, combative family.'),

-- Horror & Thriller
('Get Out', 2017, 'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg', ARRAY['Mystery', 'Thriller', 'Horror'], 'A young African-American visits his white girlfriend''s parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.'),

('A Quiet Place', 2018, 'https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg', ARRAY['Horror', 'Drama', 'Science Fiction'], 'A family is forced to live in silence while hiding from creatures that hunt by sound.'),

('Hereditary', 2018, 'https://image.tmdb.org/t/p/w500/p5pE89L7FQVCMJdI7xkAMe3hffd.jpg', ARRAY['Horror', 'Mystery', 'Thriller'], 'When Ellen, the matriarch of the Graham family, passes away, her daughter''s family begins to unravel cryptic and increasingly terrifying secrets.'),

('The Sixth Sense', 1999, 'https://image.tmdb.org/t/p/w500/fIssD3w3SvIhPPmVo4WMgZDVLID.jpg', ARRAY['Mystery', 'Thriller', 'Drama'], 'A boy who communicates with spirits seeks the help of a disheartened child psychologist.'),

-- Romance & Drama
('La La Land', 2016, 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', ARRAY['Comedy', 'Drama', 'Romance'], 'A jazz pianist falls for an aspiring actress in Los Angeles while pursuing their dreams.'),

('Eternal Sunshine of the Spotless Mind', 2004, 'https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg', ARRAY['Science Fiction', 'Drama', 'Romance'], 'When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories.'),

('The Notebook', 2004, 'https://image.tmdb.org/t/p/w500/qom1SZSENdmHFNZBXbtJAU0WTlC.jpg', ARRAY['Romance', 'Drama'], 'A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom.'),

('Pride and Prejudice', 2005, 'https://image.tmdb.org/t/p/w500/sGjIvtVvTlWnia2zfJfHz81pZ9Q.jpg', ARRAY['Drama', 'Romance'], 'Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy.'),

-- Animation
('Spider-Man: Into the Spider-Verse', 2018, 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg', ARRAY['Action', 'Adventure', 'Animation'], 'Teen Miles Morales becomes Spider-Man of his reality, crossing paths with five counterparts from other dimensions.'),

('Coco', 2017, 'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg', ARRAY['Family', 'Animation', 'Fantasy'], 'Despite his family''s baffling generations-old ban on music, Miguel dreams of becoming an accomplished musician.'),

('WALL-E', 2008, 'https://image.tmdb.org/t/p/w500/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg', ARRAY['Animation', 'Family', 'Science Fiction'], 'In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.'),

('The Lion King', 1994, 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', ARRAY['Family', 'Animation', 'Drama'], 'A Lion cub crown prince is tricked by a treacherous uncle into thinking he caused his father''s death and flees into exile.'),

-- Fantasy & Adventure
('The Lord of the Rings: The Fellowship of the Ring', 2001, 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', ARRAY['Adventure', 'Fantasy', 'Action'], 'A meek Hobbit and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth.'),

('Harry Potter and the Prisoner of Azkaban', 2004, 'https://image.tmdb.org/t/p/w500/aWxwnYoe8p2d2fcxOqtvAtJ72Rw.jpg', ARRAY['Adventure', 'Fantasy'], 'Harry Potter, Ron and Hermione return to Hogwarts for their third year. Harry comes face to face with danger.'),

('Pan''s Labyrinth', 2006, 'https://image.tmdb.org/t/p/w500/uDHqXPmZiDDCUxOFZCYKvJJHVqk.jpg', ARRAY['Fantasy', 'Drama', 'War'], 'In the Falangist Spain of 1944, the bookish young stepdaughter of a sadistic army officer escapes into an eerie but captivating fantasy world.'),

('Avatar', 2009, 'https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg', ARRAY['Action', 'Adventure', 'Fantasy', 'Science Fiction'], 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world.'),

-- Mystery & Crime
('Gone Girl', 2014, 'https://image.tmdb.org/t/p/w500/lv5xShBIDPe7m4ufdlV0IAc7Avk.jpg', ARRAY['Mystery', 'Thriller', 'Drama'], 'With his wife''s disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him.'),

('Se7en', 1995, 'https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg', ARRAY['Crime', 'Mystery', 'Thriller'], 'Two detectives hunt a serial killer who uses the seven deadly sins as his motives.'),

('The Prestige', 2006, 'https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg', ARRAY['Drama', 'Mystery', 'Science Fiction'], 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion.'),

('Shutter Island', 2010, 'https://image.tmdb.org/t/p/w500/4GDy0PHYX3VRXUtwK5ysFbg3kEx.jpg', ARRAY['Drama', 'Thriller', 'Mystery'], 'In 1954, a U.S. Marshal investigates the disappearance of a murderer who escaped from a hospital for the criminally insane.'),

-- Biographical
('The Social Network', 2010, 'https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg', ARRAY['Drama'], 'Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook.'),

('Whiplash', 2014, 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg', ARRAY['Drama', 'Music'], 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.'),

('1917', 2019, 'https://image.tmdb.org/t/p/w500/iZf0KyrE25z1sage4SYFLCCrMi9.jpg', ARRAY['War', 'Drama', 'Action'], 'At the height of the First World War, two young British soldiers must cross enemy territory to deliver a message that will stop a deadly attack.'),

('Joker', 2019, 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', ARRAY['Crime', 'Thriller', 'Drama'], 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society.');

-- Success message
SELECT 'Successfully inserted ' || COUNT(*) || ' movies' as message FROM movies;
