#!/usr/bin/env node
"use strict";
const meow = require("meow");
const isPlaylist = require("is-playlist");
const ProgressBar = require("progress");
const chalk = require("chalk");
const videos = require("videos");

const cli = meow(`
	Usage
	  $ videos <playlist_url> <api_key> <videos_path>

	Options
	  --max  The maximum amount of videos to download from the given playlist url [Default: 5]

	Examples
	  $ videos https://youtu.be/q6EoRBvdVPQ AIzaSyDIWDAP9xcj2cVu6TCY8z2uVH6Nb7TqUIM ~/Videos
	  $ videos --max=1 https://youtu.be/q6EoRBvdVPQ?list=PL7XlqX4npddfrdpMCxBnNZXg2GFll7t5y AIzaSyDIWDAP9xcj2cVu6TCY8z2uVH6Nb7TqUIM ~/Music
`);

const url = cli.input[0];
const apiKey = cli.input[1];
const videosPath = cli.input[2];
const opts = cli.flags;

function showInfo(download) {
	let bar;

	const {downloadStream, videoTitle, videoUrl} = download;

	downloadStream.on("response", res => {
		bar = new ProgressBar(`Downloading ${chalk.blue(videoTitle)} [:bar] :percent `, {
			complete: String.fromCharCode(0x2588),
			total: parseInt(res.headers["content-length"], 10)
		});
	});

	downloadStream.on("data", data => {
		bar.tick(data.length);
	});

	downloadStream.on("finish", () => {
		console.log(`Finished downloading ${chalk.blue(videoTitle)} (${chalk.underline(videoUrl)})\n`);
	});
}

videos(url, apiKey, videosPath, opts)
	.then(downloads => {
		if (isPlaylist(url)) {
			for (const download of downloads) {
				showInfo(download);
			}
		} else {
			showInfo(downloads);
		}
	});
