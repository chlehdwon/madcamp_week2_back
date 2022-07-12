import User from '../models/user.js';
import axios from 'axios';
import path from 'path';

const __dirname = path.resolve();
export const kakao_login = async (req, res) => {
  console.log(req.body);
  const { ACCESS_TOKEN } = req.body;
  let tmp;
  try {
    const url = 'https://kapi.kakao.com/v2/user/me';
    const Header = {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    };
    tmp = await axios.get(url, Header);
  } catch (e) {
    console.log('액시오스 에러');
    console.log(e);

    const response = {
      result: 'fail',
      error: '토큰 에러',
    };

    res.send(response);
    return;
  }

  try {
    const { data } = tmp;
    const { id, properties, kakao_account} = data;
    const { nickname } = properties;
    const { email, email_needs_agreement} = kakao_account;

    const result = await User.findOne({ where: { email: email+"kakao" } });

    if (result) {
      const response = {
        result: 'success',
        name: nickname,
      };
      res.send(response);
    } else {
      const payload = {
        email: email_needs_agreement ? "Undefined":email+"kakao",
        name: nickname,
        password: nickname
      };
      await User.create(payload);
      const data = (await User.findOne({ where: { email: email+"kakao" } }));
      const response = {
        result: 'success',
        name: nickname,
      };

      res.send(response);
    }
  } catch (e) {
    console.log(e);
    let msg = '';
    if (typeof e === 'string') {
      msg = e;
    } else if (e instanceof Error) {
      msg = e.message;
    }
    const response = {
      result: 'fail',
      error: msg,
    };

    res.send(response);
  }
};

export const kakao_ready = (req, res) => {
    const adf = path.join(__dirname, 'loading.html');
    console.log(adf);
    res.sendFile(adf);
  };