import random

def generate_card_number():

    number = "35"

    for i in range(13):
        number += str(random.randint(0,9))

    return number