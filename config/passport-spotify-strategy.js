const passport = require("passport");
const spotifyStrategy = require("passport-spotify").Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const env = require("./environment");
// const SpotifyWebAPI = require("spotify-web-api-node");

passport.use(
	new spotifyStrategy(
		{
			clientID: env.spotify_client_id,
			clientSecret: env.spotify_client_secret,
			callbackURL: env.spotify_callback_url,
			passReqToCallback: true,
		},
		async (req, accessToken, refreshToken, expires_in, profile, done) => {
			try {
				let user = await User.findOne({ email: profile.emails[0].value });

				// const playLists = await getSpotifyData(accessToken, refreshToken);
				// req.body.playlists = playLists;

				if (user) {
					return done(null, user);
				}
				user = await User.create({
					name: profile.displayName,
					email: profile.emails[0].value,
					password: crypto.randomBytes(20).toString("hex"),
					avatar: profile?.photos[0]?.value
						? profile.photos[0].value
						: "https://raw.githubusercontent.com/Ayush-Kanduri/Social-Book_Social_Media_Website/master/assets/images/empty-avatar.png",
				});
				return done(null, user);
			} catch (error) {
				console.log(error);
				req.flash("error", "Error in finding/creating the User !!!");
				return done(error);
			}
		}
	)
);

// const getSpotifyData = async (accessToken, refreshToken) => {
// 	try {
// 		const spotifyWebApi = new SpotifyWebAPI({
// 			accessToken: accessToken,
// 			refreshToken: refreshToken,
// 		});

// 		const spotifyUser = await spotifyWebApi.getMe();

// 		const spotifyPlaylists = await spotifyWebApi.getUserPlaylists(
// 			spotifyUser.id
// 		);

// 		let playlistArray = [];

// 		for (const playlist of spotifyPlaylists.body.items) {
// 			const tracks = await spotifyWebApi.getPlaylistTracks(playlist.id);
// 			let trackArray = [];

// 			for (const track of tracks.body.items) {
// 				trackArray.push({
// 					id: track.track.id,
// 					track: track.track.name,
// 					artist: track.track.artists[0].name,
// 					album: track.track.album.name,
// 					uri: track.track.uri,
// 					image: track.track.album.images[0].url,
// 					url: track.track.external_urls.spotify,
// 					duration: track.track.duration_ms,
// 				});
// 			}

// 			playlistArray.push({
// 				description: playlist.description,
// 				id: playlist.id,
// 				name: playlist.name,
// 				image: playlist.images[0].url,
// 				tracksURL: playlist.tracks.href,
// 				tracksCount: playlist.tracks.total,
// 				tracks: trackArray,
// 			});
// 		}

// 		return playlistArray;
// 	} catch (error) {
// 		return null;
// 	}
// };

module.exports = passport;
