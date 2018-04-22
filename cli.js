#!/usr/bin/env node
"use strict";
const meow = require("meow");
const PQueue = require("p-queue");
const chalk = require("chalk");
const ora = require("ora");
const videos = require("videos");

const cli = meow(`
	Usage
	  $ videos <playlist_url> <api_key> <videos_path>

	Options
	  --max    The maximum amount of videos to download from the given playlist url [Default: 5]
	  --start  The index to start downloading videos at [Default: 0]

	Examples
	  $ videos https://youtu.be/q6EoRBvdVPQ AIzaSyDIWDAP9xcj2cVu6TCY8z2uVH6Nb7TqUIM ~/Videos
	  $ videos --max=1 https://youtu.be/q6EoRBvdVPQ?list=PL7XlqX4npddfrdpMCxBnNZXg2GFll7t5y AIzaSyDIWDAP9xcj2cVu6TCY8z2uVH6Nb7TqUIM ~/Music
	  $ videos --start=10 https://youtu.be/q6EoRBvdVPQ?list=PL7XlqX4npddfrdpMCxBnNZXg2GFll7t5y AIzaSyDIWDAP9xcj2cVu6TCY8z2uVH6Nb7TqUIM ~/Music
`, {
	flags: {
		start: {
			type: "number"
		},
		max: {
			type: "number"
		}
	}
});

const url = cli.input[0];
const apiKey = cli.input[1];
const videosPath = cli.input[2];
const opts = cli.flags;

function showInfo(download) {
	const text = `Downloading ${chalk.blue(download.videoTitle)}`;

	const spinner = ora(text).start();
	spinner.color = "blue";

	download.onProgress(progress => {
		spinner.text = `${text}  ${chalk.grey(`${Math.floor(progress * 100)}%`)}`;
	});

	download.then(() => { // TODO: Stop the bar ticking immidiately when this event is called (or tick it to 100% before logging), to avoid bugs were the cli says "Finished downloading" yet the bar keeps on ticking.
		spinner.succeed(`Finished downloading ${chalk.blue(download.videoTitle)} ${chalk.grey(`(${chalk.underline(download.videoUrl)})`)}`);
	});

	download.catch(err => { // TODO: Use `p-timeout` to timeout if the download request takes too long to process.
		spinner.fail(`Error downloading ${chalk.blue(download.videoTitle)}:\n${chalk.red(err)}`);
	});
}

const queue = new PQueue({concurrency: 2}); // TODO: Make the concurrency constant an option. Also, try to only get the info for 2 videos at a time for better efficiency. Also, check if I should move the concurrency option to `videos`.

const downloadPromise = videos(url, apiKey, videosPath, opts);

downloadPromise.then(downloads => { // TODO: Maybe add support for downloading livestreams real-time.
	for (const download of downloads) {
		queue.add(() => { // TODO: Maybe move to using `listr` for nicer output when downloading a large amount of videos.
			showInfo(download); // TODO: Maybe add support for streaming the download directly to stdout instead of saving it to a file.

			return download;
		});
	}
});
