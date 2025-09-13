# Code Citations

## License: GPL_3_0
https://github.com/mytardis/mytardis/tree/284f0c88b6f6edff11f6c149ad53acaae742b696/assets/js/tardis_portal/view_dataset/file-upload.js

```
(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i+
```


## License: unknown
https://github.com/nikitabansal711/Ipl-Data-Project-Django/tree/c7ba8d473a0ef13e4f1b7e2762c8a85ec87e0a35/DataProject/ipl_solution/static/ipl_solution/js/ipl_solution_home.js

```
trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

//
```


## License: MIT
https://github.com/PooyaRezaee/E-Commer-Django/tree/21301b158c3075397830e1de9273146eaf1b5c6c/static/script/order/edit_order.js

```
document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if
```


## License: unknown
https://github.com/chistev/Django-Blog/tree/7e031c6ff96e361339f19c4a260ce82a629248c6/assets/js/main.js

```
cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
```


## License: unknown
https://github.com/swatya11/busticketbooking/tree/4e903a9984e6d1eec9e98406d52a612be6a549ec/App.js

```
value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          <button
```

