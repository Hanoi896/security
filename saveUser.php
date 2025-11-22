<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // JSON 데이터 받아오기
    $data = json_decode(file_get_contents('php://input'), true);

    // 기존 사용자 데이터 불러오기
    $existingData = json_decode(file_get_contents('users.json'), true);

    // 중복 아이디 확인
    foreach ($existingData as $user) {
        if ($user['id'] === $data['id']) {
            echo json_encode(['status' => 'error', 'message' => '이미 존재하는 ID입니다.']);
            exit;
        }
    }

    // 새로운 사용자 추가
    $existingData[] = $data;

    // 수정된 사용자 데이터를 users.json 파일에 저장
    file_put_contents('users.json', json_encode($existingData, JSON_PRETTY_PRINT));

    echo json_encode(['status' => 'success', 'message' => '회원 가입 성공!']);
}
?>
