package com.pamero.model;

public class Obligation {
    String periodKey;
    String start;
    String end;
    String due;
    String status;
    String received;

    public Obligation(String periodKey, String start, String end, String due, String status, String received) {
        this.periodKey = periodKey;
        this.start = start;
        this.end = end;
        this.due = due;
        this.status = status;
        this.received = received;
    }


    public String getPeriodKey() {
        return periodKey;
    }

    public void setPeriodKey(String periodKey) {
        this.periodKey = periodKey;
    }

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public String getDue() {
        return due;
    }

    public void setDue(String due) {
        this.due = due;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReceived() {
        return received;
    }

    public void setReceived(String received) {
        this.received = received;
    }
}
