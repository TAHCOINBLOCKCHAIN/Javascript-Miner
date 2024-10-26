<?php
header('Content-Type: application/json');

// Function to fetch data from a URL using cURL
function fetchData($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    return $response; // Return raw response
}

// Fetch blockchain data
$blockchainData = json_decode(fetchData('https://tahriver.online/get_blockchain_data.php'), true);

// Fetch current worth data
$worthData = fetchData('https://tahcoindex.tahriver.online/api.php'); // This will be plain text

// Fetch total wallet data
$totalWalletData = json_decode(fetchData('https://tahriver.online/get_total_wallet.php'), true);

// Combine the data
$result = [
    'total_supply' => $blockchainData['total_supply'] ?? null,
    'current_worth' => trim($worthData), // Trim any whitespace or newlines
    'total_wallets' => $totalWalletData['totalWallets'] ?? null // Add total wallets to result
];

// Return the combined data as JSON
echo json_encode($result);
?>