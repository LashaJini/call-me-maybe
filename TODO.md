# TODO

problems:
- what if user closes tab? how can we remove room from db? (~~possible solution: onbeforeunload + onunload; still not guaranteed~~)
- 1 route, 2 interpretators...

- [ ] dos attack?
- [ ] audio ?
- ~~[ ] server /rooms/:id~~
- [ ] responsive: add resize observer
- [x] 3rd peer problem
- [x] remove room when both users hangup
- [x] refresh problem (solved: by using sessionStorage + Redirect)
- [ ] queue messages
- [ ] concurrently + cross-env
- [x] wtf server build?
- [x] listen for enter key to send message
- [ ] when user reconnects, re-connect data channel
- [ ] add timestamp for messages

## Possible Expansions

- [ ] deploy.sh
- [ ] testing: e2e
- [ ] testing: ab
- [ ] workflow: cypress actions
- [ ] workflow: heroku actions
- [ ] workflow: tags
- [ ] cloud: upload logs?
- [ ] workflow: slack?
- [ ] functional?
- [ ] pwa
- [ ] workflow: dependabot
- [ ] debounce input
- [ ] wasm
- [ ] handle error/warning notifications on client side
- [ ] screensharer + keys pressed
- [ ] hotkeys
