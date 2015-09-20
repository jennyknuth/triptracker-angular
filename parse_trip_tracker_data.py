# -*- coding: utf-8 -*-
"""
Created on Sun Sep 20 09:41:39 2015

@author: gtucker
"""

import csv
import random


_TRIP_TYPE_NAMES = ['carpool', 'rtd', 'bus', 'walk', 'bike', 'skate', 'scoot',
                    'dwtr', 'op']
                    
school_string = """BCSIS
    Bear Creek
    Community Montessori
    Creekside
    Flatirons
    Foothills
    Heatherwood
    High Peaks
    Mesa
    Superior
    University Hill
    Whittier
    Horizons
    Monarch
    Casey
    Centennial
    Manhattan
    Platt
    Southern Hills
    Summit"""

SCHOOLS = school_string.split('\n')
for i in range(len(SCHOOLS)):
    SCHOOLS[i] = SCHOOLS[i].strip()


class Trip(object):
    
    def __init__(self, userId, date, distance, dw_distance, trip_type, day_part):

        self.userId = userId
        self.date = date
        self.distance = distance
        self.dw_distance = dw_distance
        self.trip_type = trip_type
        self.day_part = day_part
        

    def print_trip(self):

        print ' UserId:', self.userId
        print ' date:', self.date        
        print ' distance:', self.distance        
        print ' dw_distance:', self.dw_distance        
        print ' trip type:', self.trip_type        
        print ' day part:', self.day_part        
        
                
def read_tt_data(filename):
    """
    Opens and reads trip tracker data from file 'filename'.
    """
    with open(filename, 'r') as ttfile:
        ttreader = csv.reader(ttfile)
        ttreader.next()  # skip header line
        students = []
        for row in ttreader:
            students.append(row)
    return students
    
    
def read_trip_date_data(filename, first_record, last_record):
    """
    Opens, reads, and returns valid trip dates (i.e., school days for a 
    particular time period)
    """
    with open(filename, 'r') as datefile:
        datereader = csv.reader(datefile)
        trip_dates = []
        for row in datereader:
            trip_dates.append(row)
    return trip_dates[first_record:last_record]
    
    
def map_trips_to_dates(std, trip_dates, trips, max_trips):
    """
    For each trip in the student's record, assigns a date for the trip.
    """
    # shuffle the list of dates
    random.shuffle(trip_dates)
    
    # Initialize trip counter
    trip_counter = 0
    
    # For each trip type, assign some dates
    for i in range(8):
        trip_name = _TRIP_TYPE_NAMES[i]
        num_trips = int(std[i+3])
        #print 'std has', num_trips, trip_name, 'trips'
        for j in range(num_trips):  # for each pair of trips of this type
            trips.append(Trip(int(std[0]), trip_dates[trip_counter], std[2], 
                              std[11], trip_name, 'morning'))
            if trip_counter == max_trips:
                print 'WARNING! TOO MANY TRIPS FOR STUDENT', std[0]
            trip_counter += 1
            
            
def write_trip_data_to_file(filename, trips, student_schools):
    """
    Writes trip data to a .csv file
    """
    with open(filename, 'w') as tt_output_file:
        ttwriter = csv.writer(tt_output_file)
        ttwriter.writerow(('userId', 'date', 'day_part', 'distance', 
                           'dw_distance', 'type', 'school'))
        for trip in trips:
            ttwriter.writerow((trip.userId, trip.date[0], trip.date[1], 
                               trip.distance, trip.dw_distance, trip.trip_type,
                               student_schools[str(trip.userId)]))
                               
                               
def assign_students_to_schools(students, schools, student_schools):
    """
    Creates and returns a dictionary that links student ID numbers (keys) to 
    school names (values).
    """
    for std in students:
        std_id = std[0]
        if not std_id in student_schools:
            student_schools[std_id] = random.choice(schools)


def main():
    
    # INITIALIZE
    
    # Create data structure
    trips = []
    
    # Read TT data
    students = read_tt_data('TripTracker Data - Feb.csv')
    students.pop()  # remove messed up last element
    
    # Link students with their schools
    student_schools = {}
    assign_students_to_schools(students, SCHOOLS, student_schools)
    
    # Read trip date data
    trip_dates = read_trip_date_data('All TripTracker Dates - Sheet1.csv', 
                                     0, 36)

    # PROCESS
    for std in students:
        map_trips_to_dates(std, trip_dates, trips, 36)
    for trip in trips[0:1]:
        trip.print_trip()
        print
    
    # Read TT data
    students = read_tt_data('TripTracker Data - Mar.csv')
    students.pop()  # remove messed up last element
    assign_students_to_schools(students, SCHOOLS, student_schools)
    
    # Read trip date data
    trip_dates = read_trip_date_data('All TripTracker Dates - Sheet1.csv', 
                                     36, 72)

    # PROCESS
    for std in students:
        map_trips_to_dates(std, trip_dates, trips, 36)
    trips[-1].print_trip()
    print
    
    # Read TT data
    students = read_tt_data('TripTracker Data - Apr.csv')
    students.pop()  # remove messed up last element
    assign_students_to_schools(students, SCHOOLS, student_schools)
    
    # Read trip date data
    trip_dates = read_trip_date_data('All TripTracker Dates - Sheet1.csv', 
                                     72, 72+32)

    # PROCESS
    for std in students:
        map_trips_to_dates(std, trip_dates, trips, 32)
    for trip in trips[len(trips)-1:]:
        trip.print_trip()
        print
    
    # Read TT data
    students = read_tt_data('TripTracker Data - May.csv')
    students.pop()  # remove messed up last element
    assign_students_to_schools(students, SCHOOLS, student_schools)
    
    # Read trip date data
    trip_dates = read_trip_date_data('All TripTracker Dates - Sheet1.csv', 
                                     72+32, 72+32+40)

    # PROCESS
    for std in students:
        map_trips_to_dates(std, trip_dates, trips, 40)
    for trip in trips[len(trips)-1:]:
        trip.print_trip()
        print
    
    # CLEAN UP
    
    # Write data to file
    write_trip_data_to_file('parsed_tt_data.csv', trips, student_schools)
    
    
if __name__=='__main__':
    main()