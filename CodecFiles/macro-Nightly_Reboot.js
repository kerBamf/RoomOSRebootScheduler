import xapi from 'xapi';

let reset = true
let count = null

//Functions

//Main Reset Countdown Function
function resetCountdown() {
  xapi.Command.UserInterface.Extensions.Panel.Open({PanelId: "reset_panel"})
  showButton()
  count = 60
    let countdown = setInterval(() => {
      console.log(count)
      visualCount(count)
      if (count == 0 && reset == true) {
        clearInterval(countdown)
        xapi.Command.Video.Graphics.Clear({Target: "localOutput"})
        hideButton()
        xapi.Command.SystemUnit.Boot()
      } else if (count >= 0 && reset == false) {
        clearInterval(countdown)
        xapi.Command.Video.Graphics.Clear({Target: "localOutput"})
        reset = true
        count = null
        cancelMessage()
      }
      count = count - 1
    }, 1300)
}

//Reset cancellor to be triggered by button in reset panel as well as on main screen
function cancelReset() {
  reset = false
  xapi.Command.UserInterface.Extensions.Panel.Close()
}

//Makes reset cancel button visibility triggers
xapi.Command.UserInterface.Extensions.Panel.Update(
  { PanelId: 'aux_reset_cancel', Visibility: 'hidden' })

function showButton() {
  xapi.Command.UserInterface.Extensions.Panel.Update(
    { PanelId: 'aux_reset_cancel', Visibility: 'auto' });
};

function hideButton() {
  xapi.Command.UserInterface.Extensions.Panel.Update(
    { PanelId: 'aux_reset_cancel', Visibility: 'hidden' })
}

//Countdown visibility update function
function visualCount(count) {
  xapi.Command.UserInterface.Extensions.Widget.SetValue(
    { Value: count, WidgetId: 'widget_24' });
  xapi.Command.Video.Graphics.Text.Display(
    { Target: 'localOutput', Text: `REBOOT WILL OCCUR IN ${count} SECONDS` });
  if (count % 2 == 0 || count == null) {
    xapi.Command.UserInterface.Extensions.Panel.Update({ PanelId: 'aux_reset_cancel', Color: '#FF1B1B' })
  } else {
    xapi.Command.UserInterface.Extensions.Panel.Update({ PanelId: 'aux_reset_cancel', Color: '#FF9D1B' })
  }
}

//Cancel message alerting users that reset was successfully aborted
function cancelMessage() {
  xapi.Command.UserInterface.Message.Alert.Display(
    { Duration: 4, Text: 'System will continue normal operation', Title: "REBOOT CANCELLED" });
}


//Event Listeners

//Listener for cue from external server
xapi.Event.UserInterface.Message.Alert.Display.on((event) => {
  console.log(event)
  if (event.Title == 'NIGHTLY REBOOT INITIATED') {
    xapi.Command.Video.Graphics.Text.Display(
      { Target: 'localOutput', Text: 'NIGHTLY REBOOT INITIATED' });
    xapi.Command.UserInterface.Extensions.Widget.SetValue(
      { Value: "", WidgetId: 'widget_24' });
    setTimeout(() => {
      resetCountdown();
    }, 10000)
  };
});

xapi.Event.UserInterface.Extensions.Widget.Action.on((event) => {
  if (event.WidgetId == 'cancel_reset') {
    cancelReset()
    hideButton()
  }
})

xapi.Event.UserInterface.Extensions.Panel.Clicked.on((event) => {
  if (event.PanelId == 'aux_reset_cancel') {
    cancelReset()
    hideButton()
  }
})

