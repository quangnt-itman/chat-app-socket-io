const socket = io();

const { name, room } = $.deparam(window.location.search);

socket.on("connect", () => {
  socket.emit("USER_INFO", {
    name, room
  })
})

socket.on("disconnect", () => {
  console.log("Server downs")
})

socket.on("MESSAGE_TO_CLIENT", (msg) => {
  const newTemplate = $("#message-template").html()
  const html = Mustache.render(newTemplate, {
    content: msg.content,
    from: msg.from,
    createdAt: msg.createdAt
  })

  $("#messages").append(html)
})

$("#message-form").on("submit", (e) => {
  e.preventDefault();

  const content = $("[name=message]").val();

  socket.emit("MESSAGE_TO_SERVER", {
    from: name,
    content
  })

  $("[name=message]").val("")

  $("#messages").scrollTop($("#messages").height());
})

$("#message-location").on("click", e => {
  if (!navigator.geolocation) alert("Your browser is old")

  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    socket.emit("LOCATION_TO_SERVER", {
      from: name,
      lat, lng
    })
  })
})

socket.on("LOCATION_TO_CLIENT", msg => {
  const { lat, lng } = msg;
  const newTemplate = $("#location-template").html()
  const html = Mustache.render(newTemplate, {
    href: `https://www.google.com/maps?q=${lat},${lng}`,
    from: msg.from,
    createdAt: msg.createdAt
  })

  $("#messages").append(html)
})
