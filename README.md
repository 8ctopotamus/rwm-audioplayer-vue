# RealWealth Media Audioplayer

## Installation
You can put the following code wherever you like on your website to render the audioplayer. For optimal performance, place the code as indicated in the comments.

```
<!-- Add to the <head/> of your website -->
<link as="style" href="https://realwealthmediahttpspullzone-realwealthradiol.netdna-ssl.com/embeds/podcastplayer/v1/app.css" rel="preload" />
<link as="script" href="https://realwealthmediahttpspullzone-realwealthradiol.netdna-ssl.com/embeds/podcastplayer/v1/app.js" rel="preload" />
<link href="https://realwealthmediahttpspullzone-realwealthradiol.netdna-ssl.com/embeds/podcastplayer/v1/app.css" rel="stylesheet" />

<!-- Add wherever you want to render the player on your site -->
<div id="rw-player" data-slug="jadeweekly" data-color="midnightblue" data-autoplay data-playlist data-rwmlink></div>

<!-- Add before closing </body> tag. -->
<script src="https://realwealthmediahttpspullzone-realwealthradiol.netdna-ssl.com/embeds/podcastplayer/v1/app.js"></script>
```

## Options
You can easily customize the player by using the `data` options.

|option | desc | default
**slug** | Your the path of your realWealth URL. (Required) | _sg_
**color** | The player's color theme | _midnightblue_
**autoplay** | Make the player autoplay on load | _false_
**playlist** | Show the playlist on load | _false_
**rwmlink** | Displays the link to your Real Wealth Media page | _false_
