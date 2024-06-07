import xapi from 'xapi';

let reset = null
let count = null

//Building reboot cancel panel
const panelXML = `<Extensions>
  <Panel>
    <Order>1</Order>
    <PanelId>reset_panel</PanelId>
    <Origin>local</Origin>
    <Location>Hidden</Location>
    <Icon>Lightbulb</Icon>
    <Name>Reboot Initiated</Name>
    <ActivityType>Custom</ActivityType>
    <Page>
      <Name>AUTOMATED REBOOT INITIATED</Name>
      <Row>
        <Name>TIME UNTIL REBOOT:</Name>
        <Widget>
          <WidgetId>widget_24</WidgetId>
          <Name/>
          <Type>Text</Type>
          <Options>size=1;fontSize=normal;align=center</Options>
        </Widget>
        <Widget>
          <WidgetId>widget_25</WidgetId>
          <Type>Spacer</Type>
          <Options>size=1</Options>
        </Widget>
        <Widget>
          <WidgetId>widget_26</WidgetId>
          <Type>Spacer</Type>
          <Options>size=1</Options>
        </Widget>
        <Widget>
          <WidgetId>widget_27</WidgetId>
          <Type>Spacer</Type>
          <Options>size=1</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Cancel Reset?</Name>
        <Widget>
          <WidgetId>cancel_reset</WidgetId>
          <Name>CANCEL</Name>
          <Type>Button</Type>
          <Options>size=3</Options>
        </Widget>
        <Widget>
          <WidgetId>widget_23</WidgetId>
          <Type>Spacer</Type>
          <Options>size=1</Options>
        </Widget>
      </Row>
      <Options/>
    </Page>
  </Panel>
</Extensions>`

xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: 'reset_panel' }, panelXML);

//Building reboot cancel button
const buttonXML = `<Extensions>
  <Panel>
    <Order>2</Order>
    <PanelId>aux_reset_cancel</PanelId>
    <Origin>local</Origin>
    <Location>HomeScreenAndCallControls</Location>
    <Icon>Power</Icon>
    <Color>#FF1B1B</Color>
    <Name>CANCEL REBOOT</Name>
    <ActivityType>Custom</ActivityType>
  </Panel>
</Extensions>`

xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: 'aux_reset_cancel'}, buttonXML)

//Functions

//Main Reset Countdown Function
function resetCountdown() {
  xapi.Command.UserInterface.Extensions.Panel.Open({PanelId: "reset_panel"})
  showButton()
  reset = true
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
    }, 1100)
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
  if (count % 2 == 0) {
    xapi.Command.UserInterface.Extensions.Panel.Update({ PanelId: 'aux_reset_cancel', Color: '#FF1B1B' })
  } else {
    xapi.Command.UserInterface.Extensions.Panel.Update({ PanelId: 'aux_reset_cancel', Color: '#FF9D1B' })
  }
}

//Cancel message alerting users that reset was successfully aborted
function cancelMessage() {
  xapi.Command.UserInterface.Message.Alert.Display(
    {Duration: 4, Text: 'System will continue normal operation', Title: "REBOOT CANCELLED" });
}


//Event Listeners

//Listener for cue from external server
xapi.Event.UserInterface.Message.Alert.Display.on((event) => {
  if (event.Title == 'AUTOMATED REBOOT INITIATED') {
    xapi.Command.Video.Graphics.Text.Display(
      { Target: 'localOutput', Text: 'AUTOMATED REBOOT INITIATED' });
    xapi.Command.UserInterface.Extensions.Widget.SetValue(
      { Value: "", WidgetId: 'widget_24' });
    setTimeout(() => {
      resetCountdown()
    }, 10000)
  };
});

xapi.Event.UserInterface.Extensions.Widget.Action.on((event) => {
  console.log(event)
  if (event.WidgetId == 'cancel_reset') {
    cancelReset()
    hideButton()
  }
})

xapi.Event.UserInterface.Extensions.Panel.Clicked.on((event) => {
  console.log(event)
  if (event.PanelId == 'aux_reset_cancel') {
    cancelReset()
    hideButton()
  }
})