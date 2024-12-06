
const User = require("../models/user.js");
const Meeting = require("../models/meeting.js");
const mongoose = require('mongoose');
const { findMeetingTimes } = require('../services/meetingtime.js');


const addMeeting = async (req, res) => {
    const { meeting: {meetingName, meetingDescription, organizers, members, selectedDays, timeRange, friendUsernames, invitedUsers}, userId} = req.body;

    try {
      // This line isn't doing anything right now because meetingService.js doesn't submit a field named "friendUsernames"
      //const invitedUsers = await User.find({ username: { $in: friendUsernames } });
      const newMeeting = new Meeting({
        meetingName,
        meetingDescription,
        selectedDays,
        organizers,
        members,
        timeRange: {
          startTime: new Date(timeRange.startTime),
          endTime: new Date(timeRange.endTime),
        },
        invitedUsers: invitedUsers,
      });
  
      const savedMeeting = await newMeeting.save();
  
      // Update the user to include this meeting in their meetings array
      await User.findByIdAndUpdate(userId, { $push: { meetings: savedMeeting._id } });

      for (const userId of invitedUsers) {
        await User.findByIdAndUpdate(
          userId,
          { $push: { invited_meetings: savedMeeting._id } },
        );
      }

      res.status(201).json({ msg: 'Meeting created successfully', meeting: savedMeeting });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
};

const joinMeeting = async (req, res) => {
  const { userId, meetingId } = req.body;

  if (!userId || !meetingId) {
    return res.status(400).json({ error: "userId and meetingId are required" });
  }
  
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { invited_meetings: meetingId },
        $push: { meetings: meetingId },
      }
    );

    await Meeting.findByIdAndUpdate(
      meetingId,
      {
        $push: { members: userId }
      }
    );
    res.status(200).json({ msg: "Meeting joined successfully." });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const getJoinedMeetings = async (req, res) => {
  const { userId } = req.query;

  try {
      if (!userId) {
          return res.status(400).json({ error: 'Bad Request', message: 'User ID is required' });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ error: 'Bad Request', message: 'Invalid User ID format' });
      }

      const user = await User.findById(userId).populate('meetings');

      if (!user) {
          return res.status(404).json({ error: 'Not Found', message: 'User not found' });
      }

      res.status(200).json(user.meetings);
  } catch (err) {
      res.status(500).json({ error: 'Internal Server Error', message: 'An unexpected error occurred' });
  }
};

//!! very important to setup an invited meetings section for each user!!!
const getInvitedMeetings = async (req, res) => {
  const { userId } = req.query;

  try {
      if (!userId) {
          return res.status(400).json({ error: 'Bad Request', message: 'User ID parameter is required' });
      }
      
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ error: 'Bad Request', message: 'Invalid User ID format' });
      }

      const user = await User.findById(userId).populate('invited_meetings');

      if (!user) {
          return res.status(404).json({ error: 'Not Found', message: 'User not found' });
      }

      res.status(200).json(user.invited_meetings);
  } catch (err) {
      res.status(500).json({ error: 'Internal Server Error', message: 'An unexpected error occurred' });
  }
};

const getMeetingById = async (req, res) => {
  const { meetingId } = req.query; // Assuming the meeting ID is passed as a route parameter

  try {
    // Validate the Meeting ID
    if (!meetingId) {
      return res.status(400).json({ error: 'Bad Request', message: 'Meeting ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      return res.status(400).json({ error: 'Bad Request', message: 'Invalid Meeting ID format' });
    }

    // Fetch the meeting document
    const meeting = await Meeting.findById(meetingId);

    // If the meeting doesn't exist
    if (!meeting) {
      return res.status(404).json({ error: 'Not Found', message: 'Meeting not found' });
    }

    // Return the meeting document
    res.status(200).json(meeting);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', message: 'An unexpected error occurred' });
  }
};

const leaveMeeting = async (req, res) => {
    const { userId, meetingId } = req.body;

    if (!userId || !meetingId) {

        return res.status(400).json({ error: `userId and meetingId are required for user ${userId} and meetingId ${meetingId}` });
    }

    const is_organizer = await Meeting.findOne({ _id: meetingId, organizers: { $in: [userId] } });
    
    if (is_organizer) {
        return res.status(400).json({ error: "Organizers cannot leave their own meetings"});
    }

    try {
        await User.findByIdAndUpdate(
            userId,
            { $pull: { meetings: meetingId }, }
        );

        await Meeting.findByIdAndUpdate(
            meetingId,
            { $pull: { members: userId } }
        );
        res.status(200).json({ msg: "Left meeting successfully" });

    } catch (err) {

        res.status(500).json({ msg: 'Server error' });
    }
};

const deleteMeeting = async (req, res) => {
    const { userId, meetingId } = req.body;
    if (!userId || !meetingId) {
        return res.status(400).json({ error: "userId and meetingId are required" });
    }

    try {
        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            return res.status(404).json({ error: "Meeting not found" });
        }

        if (!meeting.organizers.includes(userId)) {
            return res.status(403).json({ error: "Only organizers can delete meetings" });
        }

        await User.updateMany(
            { $or: [{ meetings: meetingId }, { invited_meetings: meetingId }] },
            { $pull: { meetings: meetingId, invited_meetings: meetingId } }
        );

        await Meeting.findByIdAndDelete(meetingId);

        res.status(200).json({ msg: "Meeting deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
};


module.exports = {
    addMeeting,
    getJoinedMeetings,
    getInvitedMeetings,
    getMeetingById,
    leaveMeeting,
    deleteMeeting,
    joinMeeting,
};
