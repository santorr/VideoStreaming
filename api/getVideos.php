<?php
$dir = '../videos/';
$baseUrl = 'https://cdn.jsdelivr.net/gh/santorr/VideoStreaming/videos/';
$videos = [];

$files = scandir($dir);
$files = array_filter($files, function ($file) use ($dir) {
    return is_file($dir . $file) && preg_match('/\.mp4$/', $file);
});

// Optionnel : trier du plus récent au plus ancien
usort($files, function ($a, $b) use ($dir) {
    return filemtime($dir . $b) - filemtime($dir . $a);
});

foreach ($files as $file) {
    $videos[] = [
        'src' => $baseUrl . $file,
        'title' => ucfirst(pathinfo($file, PATHINFO_FILENAME)),
        'description' => 'Description for ' . $file
    ];
}

header('Content-Type: application/json');
echo json_encode($videos);
