'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  nickName: 'js',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  depositAmount() {
    let deposit = 0;
    this.movements.forEach(mov => {
      if (mov > 0) {
        deposit += mov;
      }
      labelSumIn.innerHTML = `${deposit}€`;
    });
  },
  withdrawAmount() {
    let withdraw = 0;
    this.movements.forEach(mov => {
      if (mov < 0) {
        withdraw += mov;
      }

      labelSumOut.innerHTML = `${withdraw}€`;
    });
  },
  welcome() {
    labelWelcome.innerHTML = `Welcome back , ${this.owner.split(' ')[0]}`;
    containerApp.style.opacity = '1';
  },
  logOut() {
    labelWelcome.innerHTML = `Log in to get started`;
    containerApp.style.opacity = '0';
  },
  movementRender(movArr) {
    let pos = 0;
    let ngt = 0;
    containerMovements.innerHTML = '';
    movArr.forEach(mov => {
      if (mov > 0) {
        pos++;
        containerMovements.innerHTML =
          `<div class="movements__row">
        <div class="movements__type movements__type--deposit">${pos} deposit</div>
        <div class="movements__date"></div>
        <div class="movements__value">${mov}€</div>
      </div>` + containerMovements.innerHTML;
      } else {
        ngt++;
        containerMovements.innerHTML =
          ` <div class="movements__row">
          <div class="movements__type movements__type--withdrawal">
            ${ngt} withdrawal
          </div>
          <div class="movements__date"></div>
          <div class="movements__value">${mov}€</div>
        </div>` + containerMovements.innerHTML;
      }
    });
  },
};

const account2 = {
  owner: 'Jessica Davis',
  nickName: 'jd',
  valence: 30000,
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  nickName: 'st',
  valence: 40000,
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  nickName: 'ss',
  valence: 50000,
  movements: [430, 1000, -700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

function clearInput() {
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputCloseUsername.value = '';
  inputClosePin.value = '';
  inputLoanAmount.value = '';
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
}
/////////////////////////////////////////////////
//Global Variable
let currentUser;
let clickState = false;
//Handler FUnction

//Login Click
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  accounts.forEach((curAcc, index) => {
    if (
      inputLoginUsername.value == curAcc.nickName &&
      inputLoginPin.value == curAcc.pin
    ) {
      currentUser = curAcc;
      account1.welcome.bind(curAcc)();
      account1.movementRender.bind(curAcc)(curAcc.movements);
      currentAmount(curAcc);
      clearInput();
    }
  });
});

//Logout Click
btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value == currentUser.nickName &&
    inputClosePin.value == currentUser.pin
  ) {
    account1.logOut.bind(currentUser)();
    clearInput();
  }
  clearInput();
});

//SORT MOVEMENTS
btnSort.addEventListener('click', () => {
  clickState = !clickState;
  let arr1 = [];
  let arr2 = [];
  let orgArr = currentUser.movements;
  if (clickState) {
    orgArr.forEach(mov => {
      mov > 0 ? arr1.push(mov) : arr2.push(mov);
    });
    account1.movementRender.bind(currentUser)([...arr2, ...arr1]);
  } else {
    console.log(currentUser.movements);
    account1.movementRender.bind(currentUser)(orgArr);
  }
});

//Current Amount

function currentAmount(user) {
  account1.depositAmount.bind(user)();
  account1.withdrawAmount.bind(user)();
  labelBalance.innerHTML = `${
    Number(labelSumIn.innerHTML.slice(0, -1)) +
    Number(labelSumOut.innerHTML.slice(0, -1))
  }€`;
  labelSumInterest.innerHTML = `${
    (Number(labelBalance.innerHTML.slice(0, -1)) * user.interestRate) / 100
  }€`;
}

//IN
//Loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  currentUser.valence += Number(inputLoanAmount.value);
  currentUser.movements.push(Number(inputLoanAmount.value));
  account1.movementRender.bind(currentUser)(currentUser.movements);
  currentAmount(currentUser);
  clearInput();
});

//Transfer to Other
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  accounts.forEach((curAcc, index) => {
    if (
      inputTransferTo.value == curAcc.nickName &&
      inputTransferTo.value != currentUser.nickName &&
      Number(inputTransferAmount.value) <=
        Number(labelBalance.innerHTML.slice(0, -1))
    ) {
      curAcc.movements.push(Number(inputTransferAmount.value));
      currentUser.movements.push(-Number(inputTransferAmount.value));
      account1.movementRender.bind(currentUser)(currentUser.movements);
      currentAmount(currentUser);
      console.log(currentUser.movements);
      clearInput();
    }
  });
});
