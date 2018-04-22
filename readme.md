# videos-cli [![Build Status](https://travis-ci.org/itaisteinherz/videos-cli.svg?branch=master)](https://travis-ci.org/itaisteinherz/videos-cli)

> Download videos from YouTube


## Install

```
$ npm install --global videos-cli
```


## Usage

```
$ videos --help

Usage
  $ videos <playlist_url> <api_key> <videos_path>

Options
  --max    The maximum amount of videos to download from the given playlist url [Default: 5]
  --start  The index to start downloading videos at [Default: 0]

Examples
  $ videos https://youtu.be/q6EoRBvdVPQ AIzaSyDIWDAP9xcj2cVu6TCY8z2uVH6Nb7TqUIM ~/Videos
  $ videos --max=1 https://youtu.be/q6EoRBvdVPQ?list=PL7XlqX4npddfrdpMCxBnNZXg2GFll7t5y AIzaSyDIWDAP9xcj2cVu6TCY8z2uVH6Nb7TqUIM ~/Music
  $ videos --start=10 https://youtu.be/q6EoRBvdVPQ?list=PL7XlqX4npddfrdpMCxBnNZXg2GFll7t5y AIzaSyDIWDAP9xcj2cVu6TCY8z2uVH6Nb7TqUIM ~/Music
```


## Related

- [videos](https://github.com/itaisteinherz/videos) - API for this module


## License

MIT © [Itai Steinherz](https://github.com/itaisteinherz)
