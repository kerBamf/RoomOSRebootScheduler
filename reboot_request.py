from os import environ
import requests
from urllib3.exceptions import InsecureRequestWarning

DEFAULT_PASSWORD = environ.get('PASSWORD')

def reboot_request(auth_val=DEFAULT_PASSWORD, ip='', idx=None, file=None):
    url = f"http://{ip}/putxml"
    payload = "<Command>\r\n\t<Standby>\r\n\t\t<Deactivate></Deactivate>\r\n\t</Standby>\r\n\t<UserInterface>\r\n\t\t<Message>\r\n\t\t\t<Alert>\r\n\t\t\t\t<Display>\r\n\t\t\t\t\t<Duration>10</Duration>\r\n\t\t\t\t\t<Text>Use touchpanel to cancel reboot</Text>\r\n\t\t\t\t\t<Title>AUTOMATED REBOOT INITIATED</Title>\r\n\t\t\t\t</Display>\r\n\t\t\t</Alert>\r\n\t\t</Message>\r\n\t</UserInterface>\r\n</Command>"

    headers = {'Content-Type': 'text/xml','Authorization': f'Basic {auth_val}'}
    try:
        response = requests.request("POST", url, headers=headers, data=payload, verify=False)
        response.raise_for_status()
        print(response)
    except requests.exceptions.HTTPError as err:
        print(err.response)

if __name__ == "__main__":
    codec_ip = input('Enter codec ip: ')
    reboot_request(ip=codec_ip)