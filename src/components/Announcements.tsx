import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { mockAnnouncements } from '../lib/mockData';
import { Briefcase, Plus, MapPin, Calendar, Users, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function Announcements() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState('all');

  const filteredAnnouncements = mockAnnouncements.filter(announcement => {
    if (selectedType === 'all') return true;
    return announcement.type === selectedType;
  });

  const handlePostAnnouncement = () => {
    toast.success('Announcement posted successfully!');
  };

  const handleApply = () => {
    toast.success('Application submitted successfully!');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job':
        return Briefcase;
      case 'training':
        return Users;
      case 'meeting':
        return Calendar;
      case 'tender':
        return FileText;
      default:
        return Briefcase;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'job':
        return 'bg-blue-100 text-blue-700';
      case 'training':
        return 'bg-green-100 text-green-700';
      case 'meeting':
        return 'bg-purple-100 text-purple-700';
      case 'tender':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Announcements & Opportunities</h2>
          <p className="text-gray-600">Jobs, training, and cooperative updates</p>
        </div>
        {(user?.role === 'cooperative_admin' || user?.role === 'super_admin') && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Post New Announcement</DialogTitle>
                <DialogDescription>Create a job posting, training, or update</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="announcement-type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="job">Job Opening</SelectItem>
                        <SelectItem value="training">Training/Workshop</SelectItem>
                        <SelectItem value="tender">Tender/Opportunity</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="general">General Announcement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="members_only">Members Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter announcement title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Detailed description" rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Location (optional)" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input id="deadline" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-person">Contact Person</Label>
                  <Input id="contact-person" placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input id="contact-phone" placeholder="+250 788 000 000" />
                </div>
                <Button onClick={handlePostAnnouncement}>Post Announcement</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setSelectedType('all')}>
            All
          </TabsTrigger>
          <TabsTrigger value="job" onClick={() => setSelectedType('job')}>
            Jobs
          </TabsTrigger>
          <TabsTrigger value="training" onClick={() => setSelectedType('training')}>
            Training
          </TabsTrigger>
          <TabsTrigger value="tender" onClick={() => setSelectedType('tender')}>
            Tenders
          </TabsTrigger>
          <TabsTrigger value="meeting" onClick={() => setSelectedType('meeting')}>
            Meetings
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType} className="space-y-4">
          {filteredAnnouncements.map((announcement) => {
            const TypeIcon = getTypeIcon(announcement.type);
            const isAccessible = announcement.visibility === 'public' || 
                                (announcement.visibility === 'members_only' && user?.cooperativeId === announcement.cooperativeId);

            if (!isAccessible && user?.role !== 'super_admin') return null;

            return (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getTypeBadgeColor(announcement.type).replace('text', 'bg').replace('100', '50')}`}>
                        <TypeIcon className={`h-5 w-5 ${getTypeBadgeColor(announcement.type).split(' ')[1]}`} />
                      </div>
                      <div>
                        <CardTitle>{announcement.title}</CardTitle>
                        <CardDescription className="mt-1">{announcement.cooperativeName}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getTypeBadgeColor(announcement.type)}>
                        {announcement.type}
                      </Badge>
                      <Badge className={announcement.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {announcement.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{announcement.description}</p>
                  
                  {announcement.requirements && announcement.requirements.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm mb-2">Requirements:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {announcement.requirements.map((req, idx) => (
                          <li key={idx} className="text-sm text-gray-600">{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b">
                    {announcement.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{announcement.location}</span>
                      </div>
                    )}
                    {announcement.deadline && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{announcement.deadline}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {announcement.applicants || 0} applicants
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Posted: {announcement.postedDate}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-gray-600">Contact: {announcement.contactPerson}</p>
                      <p className="text-gray-600">{announcement.contactPhone}</p>
                    </div>
                    
                    {announcement.status === 'active' && announcement.type !== 'meeting' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>Apply Now</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Apply for {announcement.title}</DialogTitle>
                            <DialogDescription>{announcement.cooperativeName}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="applicant-name">Full Name</Label>
                              <Input id="applicant-name" placeholder="Your full name" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="applicant-email">Email</Label>
                              <Input id="applicant-email" type="email" placeholder="your.email@example.com" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="applicant-phone">Phone Number</Label>
                              <Input id="applicant-phone" placeholder="+250 788 000 000" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cover-letter">Cover Letter / Message</Label>
                              <Textarea 
                                id="cover-letter" 
                                placeholder="Tell us why you're interested..." 
                                rows={4}
                              />
                            </div>
                            <Button className="w-full" onClick={handleApply}>
                              Submit Application
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
