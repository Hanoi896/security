// 현재 로그인된 사용자 정보 가져오기
let currentUser = localStorage.getItem('currentUser');

// 로그인 아이콘 클릭 시 드롭다운 메뉴 토글
function toggleDropdownMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// 로그인 창 열기
function openLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

// 회원가입 창 열기
function openRegister() {
    document.getElementById('registerModal').style.display = 'block';
    document.getElementById('registerID').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerPasswordConfirm').value = '';
}

// 로그인 처리
function login() {
    const id = document.getElementById('loginID').value;
    const password = document.getElementById('loginPassword').value;

    if (id === '' || password === '') {
        alert('아이디와 비밀번호를 입력해주세요.');
        return;
    }

    // 관리자 계정 확인
    if (id === 'admin' && password === '123456789') {
        currentUser = id;
        localStorage.setItem('currentUser', currentUser);
        alert(`${id}님 환영합니다! 관리 페이지로 이동합니다.`);
        location.href = 'admin.html';
        return;
    }

    // 저장된 사용자 목록 가져오기
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(user => user.id === id);

    if (user && user.password === password) {
        currentUser = id;
        localStorage.setItem('currentUser', currentUser);
        alert(`${id}님 환영합니다!`);
        updateUIForLogin();
        closeModals();
    } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
}

// 회원가입 처리
function register() {
    const id = document.getElementById('registerID').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerPasswordConfirm').value;

    if (id === '' || password === '' || confirmPassword === '') {
        alert('모든 필드를 입력해주세요.');
        return;
    }

    if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    // 기존 사용자 목록 가져오기
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    // ID 중복 확인
    if (users.some(user => user.id === id)) {
        alert('이미 존재하는 아이디입니다.');
        return;
    }

    // 새 사용자 추가
    users.push({ id, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('회원가입이 완료되었습니다.');
    setTimeout(() => {
        closeModals();
        openLogin();
    }, 1000);
}

// 사용자 관리 페이지 열기 (관리자 전용)
function manageUsers() {
    document.getElementById('userManagement').style.display = 'block';
    loadUserList();
}

// 사용자 목록 불러오기
function loadUserList() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.password}</td>
            <td><button onclick="deleteUser(${index})">삭제</button></td>
        `;
        userList.appendChild(row);
    });
}

// 사용자 추가 (관리자)
function addUser() {
    const userId = prompt("새 사용자 ID를 입력하세요:");

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.id === userId)) {
        alert("이미 존재하는 ID입니다. 다른 ID를 입력하세요.");
        return;
    }

    const userPassword = prompt("새 사용자 비밀번호를 입력하세요:");
    if (userId && userPassword) {
        users.push({ id: userId, password: userPassword });
        localStorage.setItem('users', JSON.stringify(users));
        loadUserList();
    }
}

// 사용자 삭제 (관리자)
function deleteUser(index) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    loadUserList();
}

// 로그아웃
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForLogout();
    alert('로그아웃 되었습니다.');
}

// 로그인 상태 UI 업데이트
function updateUIForLogin() {
    document.getElementById('loginButton').style.display = 'none';
    document.getElementById('registerButton').style.display = 'none';
    document.getElementById('myInfoButton').style.display = 'block';
    document.getElementById('logoutButton').style.display = 'block';
    document.getElementById('welcomeMessage').innerText = `${currentUser}님 환영합니다!`;
}

// 로그아웃 상태 UI 업데이트
function updateUIForLogout() {
    document.getElementById('loginButton').style.display = 'block';
    document.getElementById('registerButton').style.display = 'block';
    document.getElementById('myInfoButton').style.display = 'none';
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('welcomeMessage').innerText = '환영합니다!';
}

// 내 정보 화면으로 이동
function goToMyInfo() {
    if (currentUser === 'admin') {
        location.href = 'admin.html';
    } else {
        document.getElementById('myInfoScreen').style.display = 'block';
        document.getElementById('welcomeMessage').style.display = 'none';
    }
}

// 내 정보 화면에서 돌아가기
function returnToMain() {
    document.getElementById('myInfoScreen').style.display = 'none';
    document.getElementById('welcomeMessage').style.display = 'block';
}

// 계정 삭제
function deleteAccount() {
    const confirmation = confirm("정말로 계정을 삭제 하겠습니까?");
    if (confirmation) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(user => user.id !== currentUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.removeItem('currentUser');
        alert('계정이 삭제되었습니다.');
        updateUIForLogout();
        returnToMain();
    }
}

// 모달 닫기
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// 회원가입 창 닫고 로그인 창 열기
function closeRegister() {
    document.getElementById('registerModal').style.display = 'none';
    openLogin();
}

// 페이지 로드 시 로그인 상태 체크
document.addEventListener('DOMContentLoaded', function () {
    if (currentUser) {
        updateUIForLogin();
    }
});
