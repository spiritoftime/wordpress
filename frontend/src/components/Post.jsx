import React from "react";
const htmlPost = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>S5 - THE CATARACT METAVERSE 1</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 20px;
    }
    h1 {
      color: #007bff;
    }
    .icon {
      width: 20px;
      height: 20px;
      margin-right: 5px;
      vertical-align: middle;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border:none;
    }
    th, td {
            padding: 8px;
      text-align: left;
    }
    th {
      background-color:  #384044;
      color:#fff;
      text-align:center;
    }
    .speaker-name {
      font-weight: bold;
      text-align:center;
    }
    .discussion{
      background-color:#CBD5DC;
    }
    .topic{
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>(S5) THE CATARACT METAVERSE 1</h1>
  <p><span class="icon">📅</span>Friday, 9 June 2023</p>
  <p><span class="icon">⏰</span>07:30 – 08:50hrs</p>
  <p><span class="icon">📍</span>Hall B, Level 4, Suntec</p>
  <p>
    Experts will provide the most up-to-date and comprehensive teaching on the various steps in phaco ranging from incision to surgical steps. Expect a fast and furious session from top international phaco surgeons.
  </p>
  <p>
    Chairs: Mahbubur CHOWDHURY, Bangladesh • Ronald YEOH, Singapore
  </p>
  <table>
    <thead>
      <tr>
        <th>Time</th>
        <th>Topic</th>
        <th>Speaker</th>
      </tr>
    </thead>
    <tbody>
      <tr class="presentation">
        <td class="presentation-duration">07:30 - 07:37hrs</td>
        <td class="topic">Phaco through a Fog</td>
        <td class="speaker-name">John WONG<br>Singapore</td>
      </tr>
      <tr class="discussion">
        <td class="presentation-duration">07:37 - 07:40hrs</td>
        <td class="topic">Discussion</td>
        <td class="speaker-name"></td>
      </tr>
      <tr>
        <td>07:40 - 07:47hrs</td>
        <td>Phacoemulsification in Corneal Opacities/Corneal Ectasias</td>
        <td class="speaker-name">Namrata SHARMA<br>India</td>
      </tr>
      <tr>
        <td>07:47 - 07:50hrs</td>
        <td>Discussion</td>
        <td></td>
      </tr>
      <tr>
        <td>07:50 - 07:57hrs</td>
        <td>Wavefront IOL for Post Laser Refractive Surgery</td>
        <td class="speaker-name">Pichit NARIPTHAPHAN<br>Thailand</td>
      </tr>
      <tr>
        <td>07:57 - 08:00hrs</td>
        <td>Discussion</td>
        <td></td>
      </tr>
      <tr>
        <td>08:00 - 08:07hrs</td>
        <td>IOLs in Keratoconus</td>
        <td class="speaker-name">Filomena RIBEIRO<br>Portugal</td>
      </tr>
      <tr>
        <td>08:07 - 08:10hrs</td>
        <td>Discussion</td>
        <td></td>
      </tr>
      <tr>
        <td>08:10 - 08:17hrs</td>
        <td>Miyake Maneuvers</td>
        <td class="speaker-name">Wilson Takashi HIDA<br>Brazil</td>
      </tr>
      <tr>
        <td>08:17 - 08:20hrs</td>
        <td>Discussion</td>
        <td></td>
      </tr>
      <tr>
        <td>08:20 - 08:27hrs</td>
        <td>Advanced Radio-Frequency (RF) Technology for Treatment of Ocular Surface Diseases</td>
        <td class="speaker-name">Chul Young CHOI<br>South Korea</td>
      </tr>
      <tr>
        <td>08:27 - 08:30hrs</td>
        <td>Discussion</td>
        <td></td>
      </tr>
      <tr>
        <td>08:30 - 08:37hrs</td>
        <td>Cataract Surgery & Dementia: A growing problem for us all</td>
        <td class="speaker-name">Paul G. URSELL<br>UK</td>
      </tr>
      <tr>
        <td>08:37 - 08:40hrs</td>
        <td>Discussion</td>
        <td></td>
      </tr>
      <tr>
        <td>08:40 - 08:47hrs</td>
        <td>Dysfunctional Lens Index: A game changer in refractive surgery decision making?</td>
        <td class="speaker-name">Gaurav LUTHRA<br>India</td>
      </tr>
      <tr>
        <td>08:47 - 08:50hrs</td>
        <td>Discussion</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</body>
</html>`;

const Post = () => {
  return <div dangerouslySetInnerHTML={{ __html: htmlPost }} />;
};

export default Post;
