
import './Project.css';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import AddIcon from '@material-ui/icons/Add';
import Issue from '../../components/Issue'
import EditProjectModal from '../../components/EditProjectModal'
import AddMember from '../../components/AddMember'
import AddIssue from '../../components/AddIssue'
import ProjectIssueModal from '../../components/ProjectIssueModal'
import ProjectAPI from '../../utils/ProjectAPI'
import UserAPI from '../../utils/UserAPI'
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Link,
  useParams
} from "react-router-dom";

import axios from 'axios'

// let mongoose = require('mongoose')

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  projecthead: {
    marginTop: 40,
  },
  projecttitle: {
    marginBottom: 20,
  },
  issueleft: {
    paddingRight: 20,
  },
  issueright: {
    paddingLeft: 20,
    borderLeft: '1px solid #ccc',
  },
  members: {
    // paddingLeft: 20,
    borderLeft: '1px solid #fff',
  },
  issuerightchip: {
    marginBottom: 20,
    borderLeft: '1px solid #ccc',
  },
  projectcard: {
    marginRight: 20,
    marginBottom: 20,
  },
  column: {
    marginRight: 20,
    marginBottom: 20,
  },
  right: {
    textAlign: 'right',
    paddingRight: 20,
    marginBottom: 20,
  },
  columntest: {
    backgroundColor: '#ffffff',
    borderTop: '3px solid #cccccc',
  }, 
  allmembers: {
    marginBottom: 12,
  },
  memberschip: {
    marginLeft: 6,
  },
  addbtn: {
    marginLeft: 6,
  }
});

const Project = () => {
  const classes = useStyles();
  
  // ====================== Modals ======================
  // Modal: Open an issue 
  // eslint-disable-next-line
  const [openIssue, setIssueOpen] = useState(false);
  const [status, setStatus] = useState({ isLoading: true });
  const [members, setMembers] = useState([])
  const params = useParams();
  const { isLoading, project, err } = status;

  const handleIssueOpen = _id => {
    let issues = status.project.issues

    issues = issues.map(issue => {
      if (_id === issue._id) {
        issue.isOpen = !issue.isOpen
      }
      return issue
    })
    const project = status.project
    project.issues = issues
    setStatus({ project })
  }

  const [archived, setArchived] = useState({ isLoading: true });

  const handleIssueArchive = _id => {
    let issues = status.project.issues

    issues = issues.map(issue => {
      if (_id === issue._id) {
        issue.isArchived = !issue.isArchived
      }
      return issue
    })
    const project = status.project
    project.issues = issues
    setArchived({ project })
  }

  //  Modal: Edit Project
  const [openEditProject, setEditProjectOpen] = useState(false);
  const handleEditProjectOpen = () => {
    setEditProjectOpen(true);
  };



  const [doomedMember, setDoomedMember] = useState('')

  const handleDelete = (e) => {
    console.log(e.target.parentNode.parentNode.id, 'user id to be deleted')
    let member=e.target.parentNode.parentNode.id
    
    let id = project._id
    console.log(id, 'this is the project id')
    
    // UserAPI.getOneById(member) 
    //   .then(user  => {
    //     console.log(user, 'this is user')
        ProjectAPI.removeMember(id, {_id: member})
          .then((res) => {
           console.log(res)
           window.location.reload()
          })
          .catch(err => console.error(err))
            
      // }) 

    
  }


  // Modal: Add Issue
  const [openAddIssue, setAddIssueOpen] = useState(false);
  const handleAddIssueOpen = () => {
    setAddIssueOpen(true);
  };

  // Modal: Add Member
  const [openAddMember, setAddMemberOpen] = useState(false);
  const handleAddMemberOpen = () => {
    setAddMemberOpen(true);
  };
  
  // Modal: Close all Modals
  // eslint-disable-next-line
  const handleClose = () => {
    setIssueOpen(false);
    setAddIssueOpen(false);
    setAddMemberOpen(false);
    setEditProjectOpen(false)
  };

  const statusColor = {
    Open: "rgb(113, 153, 116)",
    'In Progress': "#f79d0c",
    Closed: "red"
  }

  const obj = {
    Medium: "#f79d0c",
    High: "red",
    Low: "#14a7fc"
  }

  // ====================== API CALLS ======================
  // Get Project Info

  useEffect(() => {
    ProjectAPI.getById(params.projectId)
      .then(res => {
        console.clear()
        console.log('SEE HERE res.data', res.data)
        const project = res.data
        project.issues = res.data.issues.map(issue => ({
          ...issue,
          isOpen: false,
          isArchived: false
        }))
        setStatus({ project })
        setMembers(res.data.members)
        
        
      })
      .catch(err => setStatus({ err: err }))
  // eslint-disable-next-line
    }, [])

  return  isLoading ? <span>loading...</span> : err ? <h1>{err.message}</h1> : (
    <>
      {/* Project Header */}
      <Grid container className={classes.projecthead}>
        
        {/* Project Title */}
        <Grid item xs={12} md={11}>
          
          <Typography className={classes.projecttitle} variant="h3" component="h2">
              {project.title}
          </Typography>
          
        </Grid>
        {/* Edit Project Button */}
        <Grid className={classes.columngrid} item xs={1}>
          <div className={classes.editbtn}>
            <Link onClick={handleEditProjectOpen}>
              <Chip
              clickable
              label="Edit Project"
              variant="outlined"
              size='small'
            />
            </Link>
            <EditProjectModal 
              open={openEditProject} 
              title={project.title}
              description={project.description}
              owner={project.owner.name}
              members={project.members}
              handleClose={() => setEditProjectOpen(false)}
            />
          </div>
        </Grid>
        
        </Grid>
      {/* Project owner/member info bar */}
      <Grid container>
        <Grid className={classes.columngrid} item xs={12}>
          <Grid container className={classes.allmembers}>
            {/* Project Owner Chip */}
            <Grid item xs={12} md={3}>
              <span className={classes.title} color="textSecondary">
                Project Lead <Chip
                  // icon={<FaceIcon />}
                  label={project.owner.name}
                  variant="outlined"
                />
              </span>
            </Grid>
            {/* Project Members Chips */}

            
            <Grid item xs={12} md={9}>
              <span className="members">Project Members 
                {project.members.slice(1).map((members) => (
                  <span id={members._id}>
                    <Chip
                      key={members.id}
                      // icon={<FaceIcon />}
                      clickable
                      label={members.name}
                      className={classes.memberschip}
                      onDelete={handleDelete}
                      color="default"
                      variant="outlined"
                      label={members.name}
                    />
                    </span>
                ))}
                {/* Add Member Chip */}
                <Link onClick={handleAddMemberOpen}>
                  <Chip
                    icon={<AddIcon />}
                    clickable
                    className={classes.addbtn}
                    label="Add Member"
                    variant="outlined"
                  />
                </Link>
                <AddMember
                  open={openAddMember}
                  handleClose={() => setAddMemberOpen(false)}
                  projectId={params.projectId}
                />
              </span>
            </Grid>
          </Grid>
          
          {/* Project Description */}
          <div className={classes.column}>
            <Card>
              <CardContent>
                <Typography>
                 {project.description}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>

      {/* Add Issue Chip + Open/IP/Closedcolumns */}
      <Grid container>
        <Grid className={classes.right} item xs={12}>
          {/* Add Issue Chip */}
          <Link onClick={handleAddIssueOpen}>
            <Chip
              icon={<AddIcon />}
              clickable
              className={classes.addbtn}
              label="Add Issue"
              // variant="outlined"
              color="primary"
            />
          </Link>
          <AddIssue
            open={openAddIssue}
            handleClose={() => setAddIssueOpen(false)}
          />
        </Grid>

        {/* Open Issues column */}
        {['Open', 'In Progress', 'Closed'].map(column => (
          <Grid key={column} className={classes.columngrid} item xs={12} lg={4}>
            <div className={classes.column}>
              
              <Card className={classes.columntest} style={{ borderColor: statusColor[column] }}>
                  <CardContent>
                    <Typography className={classes.mb} variant="h5" component="h5">
                      {column}
                    </Typography>
                    
                    {project.issues.filter(issue => issue.status === column).map((issueData) => (
                      <>
                        <Link onClick={() => handleIssueOpen(issueData._id)}>
                          <Issue
                            title={issueData.title}
                            body={issueData.body}
                            priority={issueData.priority}
                          />
                        </Link>
                        
                        <ProjectIssueModal
                          key={issueData._id}
                          id={issueData._id}
                          title={issueData.title}
                          body={issueData.body}
                          status={issueData.status}
                          priority={issueData.priority}
                          isPublic={issueData.isPublic}
                          author={issueData.author.name}
                          replies={issueData.replies}
                          open={issueData.isOpen}
                          handleClose={() => handleIssueOpen(issueData._id)}
                        />
                      </>
                    ))}
                  </CardContent>
                </Card>
              
            </div>
          </Grid>
        ))}

      </Grid>
    </>
  )
}

export default Project